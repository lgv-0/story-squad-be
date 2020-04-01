import { Router } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';

import { Child, Matches, Stories, Illustrations } from '../../database/entity';
import { MatchInfoRepository } from './custom';

import { Only } from '../../middleware/only/only.middleware';
import { connection } from '../../util/typeorm-connection';

const battlesRoutes = Router();

battlesRoutes.get('/battles', Only(Child), async (req, res) => {
    try {
        const { id, cohort, username, avatar, stories, illustrations } = req.user as Child;
        //first get matchid so we know who this child is up against

        const match = await returnMatch(id, cohort.week);

        let thisMatch = {
            matchId: match.id,
            week: cohort.week,
            team: {
                student: {
                    studentId: id,
                    username: username,
                    avatar: avatar,
                    story: {},
                    illustration: {}
                },
                teammate: {}
            },
        };
        let teammate = null
        if (!match) {
            res.json(401).json({
                message: `Match for Student ID ${id}, for week ${cohort.week} not found`,
            });
        } else {

            { 
                match.team1_child1_id === id ? teammate = match.team1_child2_id :
                match.team1_child2_id === id ? teammate = match.team1_child1_id :
                match.team2_child1_id === id ? teammate = match.team2_child2_id : teammate = match.team2_child1_id
            }
            console.log(teammate)
            const [ story ] = stories.filter(el => el.week === cohort.week)
            const [ illustration ] = illustrations.filter(el => el.week === cohort.week)

            thisMatch.team.student = { ...thisMatch.team.student, story: story, illustration: illustration}
            thisMatch.team.teammate = await getCustomRepository(MatchInfoRepository, connection()).findStudentInfo(teammate, cohort.week)
            // thisMatch.team.teammate = await getCustomRepository(MatchInfoRepository,)
            // previous syntax structure commented out below 3.12.20
            // new syntax structure (yet to be tested) 3.18.20
            }

        return res.status(200).json({
            thisMatch,
        });
    } catch (err) {
        console.log(err.toString());
        return res.status(500).json({ message: err.toString() });
    }
});

battlesRoutes.put('/battles', Only(Child), async (req, res) => {
    try {

        const { id, progress } = req.user as Child;

        if (progress.teamReview === true) {
            return res.status(400).json({
                message: `Cannot submit points twice`
            })
        }

        const { stories, illustrations } = req.body
        
        try {
            await Promise.all(stories.map(el => {
                getRepository(Stories, connection())
                .findOne({ id: el.id })
                .then( async (res) => {
                    await getRepository(Stories, connection())
                    .update({ id: el.id}, { points: res.points + el.points})
                })
            }))
        } catch(err) {
            res.status(400).json({ message: `Story failed`})
        }

        try {
            await Promise.all(illustrations.map(el => {
                getRepository(Illustrations, connection())
                .findOne({ id: el.id })
                .then( async (res) => {
                    await getRepository(Illustrations, connection())
                    .update({ id: el.id}, { points: res.points + el.points})
                })
            }))
        } catch(err) {
            res.status(400).json({ message: 'Illustration failed' })
        }

        await getRepository(Child, connection()).update({ id }, { progress: { teamReview: true } });

        res.status(200).json({ message: 'success' });
    } catch (err) {
        res.status(500).json({ message: err.toString() });
    }
});

export { battlesRoutes };

async function returnMatch(id: number, week: number) {
    const match = await getRepository(Matches, connection()).findOne({
        where: [{ team1_child1_id: id, week: week }],
    });

    return match ? match : r2(id, week);
}
async function r2(id: number, week: number) {
    const match = await getRepository(Matches, connection()).findOne({
        where: [{ team1_child2_id: id, week: week }],
    });
    return match ? match : r3(id, week);
}
async function r3(id: number, week: number) {
    const match = await getRepository(Matches, connection()).findOne({
        where: [{ team2_child1_id: id, week: week }],
    });
    console.log(match);
    return match ? match : r4(id, week);
}
async function r4(id: number, week: number) {
    const match = await getRepository(Matches, connection()).findOne({
        where: [{ team2_child2_id: id, week: week }],
    });
    console.log(match);
    return match ? match : null;
}
