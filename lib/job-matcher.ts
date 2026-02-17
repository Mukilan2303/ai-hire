import type { Job, CandidateFile } from "./store"

/**
 * Job Matcher - Calculates how well a candidate matches a specific job
 */

export interface JobMatchResult {
    matchScore: number
    skillsMatch: number
    experienceMatch: number
    strengths: string[]
    gaps: string[]
    summary: string
    successProbability: number
    risk: "low" | "medium" | "high"
    hiddenTalent: boolean
}

/**
 * Calculate skill match percentage
 */
export function compareSkills(candidateSkills: string[], jobSkills: string[]): number {
    if (jobSkills.length === 0) return 100

    const candidateSkillsLower = candidateSkills.map(s => s.toLowerCase())
    const jobSkillsLower = jobSkills.map(s => s.toLowerCase())

    const matchingSkills = jobSkillsLower.filter(jobSkill =>
        candidateSkillsLower.some(candSkill =>
            candSkill.includes(jobSkill) || jobSkill.includes(candSkill)
        )
    )

    return Math.round((matchingSkills.length / jobSkillsLower.length) * 100)
}

/**
 * Calculate experience match based on years
 */
export function compareExperience(candidateExp: string, jobExp: string): number {
    // Extract years from strings like "5+ years" or "3-5 years"
    const extractYears = (exp: string): number => {
        const match = exp.match(/(\d+)\+?/)
        return match ? parseInt(match[1]) : 0
    }

    const candYears = extractYears(candidateExp)
    const jobYears = extractYears(jobExp)

    if (candYears === 0 || jobYears === 0) return 70 // Default if can't parse

    if (candYears >= jobYears) return 100
    if (candYears >= jobYears * 0.8) return 85
    if (candYears >= jobYears * 0.6) return 70
    return 50
}

/**
 * Main function: Calculate job-specific match
 */
export function calculateJobMatch(
    candidateSkills: string[],
    candidateExperience: string,
    job: Job
): JobMatchResult {
    // Calculate component scores
    const skillsMatch = compareSkills(candidateSkills, job.skills)
    const experienceMatch = compareExperience(candidateExperience, job.experience)

    // Weighted match score: 60% skills, 40% experience
    const matchScore = Math.round(skillsMatch * 0.6 + experienceMatch * 0.4)

    // Identify matching and missing skills
    const candidateSkillsLower = candidateSkills.map(s => s.toLowerCase())
    const jobSkillsLower = job.skills.map(s => s.toLowerCase())

    const matchingSkills = job.skills.filter(jobSkill =>
        candidateSkillsLower.some(candSkill =>
            candSkill.toLowerCase().includes(jobSkill.toLowerCase()) ||
            jobSkill.toLowerCase().includes(candSkill.toLowerCase())
        )
    )

    const missingSkills = job.skills.filter(jobSkill =>
        !candidateSkillsLower.some(candSkill =>
            candSkill.toLowerCase().includes(jobSkill.toLowerCase()) ||
            jobSkill.toLowerCase().includes(candSkill.toLowerCase())
        )
    )

    // Generate strengths
    const strengths: string[] = []
    if (matchingSkills.length > 0) {
        strengths.push(`Strong match in ${matchingSkills.slice(0, 3).join(", ")}`)
    }
    if (experienceMatch >= 85) {
        strengths.push("Meets experience requirements")
    }
    if (matchingSkills.length >= job.skills.length * 0.8) {
        strengths.push("Comprehensive skill coverage")
    }

    // Generate gaps
    const gaps: string[] = []
    if (missingSkills.length > 0) {
        gaps.push(`Missing: ${missingSkills.join(", ")}`)
    }
    if (experienceMatch < 70) {
        gaps.push("Below required experience level")
    }

    // Calculate success probability (based on match score with some variance)
    const successProbability = Math.min(
        Math.max(matchScore - 5 + Math.floor(Math.random() * 10), 40),
        95
    )

    // Determine risk level
    let risk: "low" | "medium" | "high"
    if (matchScore >= 80 && missingSkills.length <= 1) risk = "low"
    else if (matchScore >= 65 && missingSkills.length <= 2) risk = "medium"
    else risk = "high"

    // Detect hidden talent (high potential despite some gaps)
    const hiddenTalent =
        matchScore >= 75 &&
        matchingSkills.length >= 3 &&
        experienceMatch >= 70

    // Generate summary
    let summary = ""
    if (matchScore >= 85) {
        summary = `Excellent fit for ${job.title}. ${matchingSkills.length > 0 ? `Strong expertise in ${matchingSkills.slice(0, 2).join(" and ")}.` : ""}`
    } else if (matchScore >= 70) {
        summary = `Good candidate for ${job.title}. ${matchingSkills.length > 0 ? `Solid skills in ${matchingSkills.slice(0, 2).join(" and ")}.` : ""} ${missingSkills.length > 0 ? `Could develop ${missingSkills[0]}.` : ""}`
    } else if (matchScore >= 55) {
        summary = `Moderate fit for ${job.title}. ${matchingSkills.length > 0 ? `Has ${matchingSkills[0]} experience.` : ""} ${missingSkills.length > 0 ? `Needs training in ${missingSkills.slice(0, 2).join(" and ")}.` : ""}`
    } else {
        summary = `Limited match for ${job.title}. ${missingSkills.length > 0 ? `Missing key skills: ${missingSkills.slice(0, 2).join(", ")}.` : ""} May be better suited for different role.`
    }

    return {
        matchScore,
        skillsMatch,
        experienceMatch,
        strengths,
        gaps,
        summary,
        successProbability,
        risk,
        hiddenTalent,
    }
}

/**
 * Generate job-specific insights for AI Copilot
 */
export function generateJobInsights(candidate: CandidateFile, job: Job): string {
    const match = calculateJobMatch(candidate.skills, candidate.experience, job)

    return `For ${job.title}: ${match.summary} Match score: ${match.matchScore}%. ${match.hiddenTalent ? "⭐ Hidden talent potential detected." : ""
        }`
}
