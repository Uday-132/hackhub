const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Roadmap = require('../models/Roadmap');
const User = require('../models/userModel');

// Generate Roadmap
router.post('/generate', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const { careerGoal, skillLevel, targetOutcome, availability } = req.body; // Expect these in body for now, or update user first

        // Update user preference if provided
        if (careerGoal) user.careerGoal = careerGoal;
        if (skillLevel) user.skillLevel = skillLevel;
        if (targetOutcome) user.targetOutcome = targetOutcome;
        if (availability) user.availability = availability;
        await user.save();

        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ msg: 'Server Protocol Error: API Key missing' });
        }

        // Prompt Construction
        const prompt = `
        Act as an expert career coach. Create a detailed learning roadmap for a user with the following profile:
        - Career Goal: ${user.careerGoal}
        - Current Skill Level: ${user.skillLevel}
        - Weekly Availability: ${user.availability} hours
        - Target Outcome: ${user.targetOutcome}

        **RESOURCE SELECTION RULES (CRITICAL):**
        1. **Video-Based Learning (Primary):** Best for beginners. Use YouTube crash courses or playlists. (Low bandwidth, easy access).
        2. **Interactive / Practice Platforms:** freeCodeCamp, HackerRank, Kaggle. (Hands-on learning).
        3. **Official Documentation (Secondary):** MDN, Python docs. (For correctness).
        
        **STRICTLY AVOID:**
        - ❌ Random blog links
        - ❌ Paid courses (Udemy, Coursera unless free)
        - ❌ Too many resources (Max 2-3 per month)
        
        Generate a JSON response with the following structure, strictly adhering to this schema:
        {
            "months": [
                {
                    "id": 1,
                    "title": "Month 1: [Theme]",
                    "subtitle": "[Brief Goal]",
                    "description": "[Detailed explanation of this month's focus]",
                    "skills": ["Skill 1", "Skill 2"],
                    "topics": [
                        { "id": "week1-topic1", "title": "[Topic Title]" }
                    ],
                    "resources": [
                        { 
                            "title": "[Resource Title]", 
                            "url": "[URL]", 
                            "type": "Video" | "Interactive" | "Documentation",
                            "duration": "[Duration, e.g. '5 hours']"
                        }
                    ]
                }
            ]
        }
        Generate a 3-6 month roadmap depending on complexity. Ensure "id"s are unique.
        Only return the valid JSON, no markdown formatting.
        `;

        // Call Groq API
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Groq API Error:', data);
            return res.status(500).json({ msg: 'Error generating roadmap via AI', error: data });
        }

        let roadmapContent;
        try {
            // Extract JSON from potential text wrapper
            const content = data.choices[0].message.content;
            // Simple cleanup if needed (e.g. remove markdown ```json ... ```)
            const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
            roadmapContent = JSON.parse(cleanContent);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            return res.status(500).json({ msg: 'Failed to parse AI response', raw: data.choices[0].message.content });
        }

        // Save to Database
        const newRoadmap = new Roadmap({
            user: req.user.id,
            goal: user.careerGoal,
            months: roadmapContent.months
        });

        const savedRoadmap = await newRoadmap.save();
        res.json(savedRoadmap);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get User's Roadmap
router.get('/', protect, async (req, res) => {
    try {
        const roadmaps = await Roadmap.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(roadmaps);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
