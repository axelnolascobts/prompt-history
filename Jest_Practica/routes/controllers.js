const fs = require('fs');
const AJV = require('ajv');
const AJVFORMATS = require('ajv-formats');

const DATA_ROUTE = "/home/user/Documentos/prompt-history/Jest_Practica/data/db.json";

const AJV_VALIDATOR = new AJV({ allErrors: true });
AJVFORMATS(AJV_VALIDATOR);

const TEAM_SCHEMA = {

    type: "object",
    properties: {
        teamName: { type: 'string' },
        cityTeam: { type: 'string' },
        playerNames: { type: 'array', items: { type: 'string' }, minItems: 5 }
    },
    required: ["teamName", "cityTeam", "playerNames"],
    additionalProperties: false
};

const EDIT_TEAM_SCHEMA = {

    type: "object",
    properties: {
        teamName: { type: 'string' },
        cityTeam: { type: 'string' },
        playerNames: { type: 'array', items: { type: 'string' }, minItems: 5 }
    },
    additionalProperties: false

};

const VALIDATE_TEAM = AJV_VALIDATOR.compile(TEAM_SCHEMA);
const VALIDATE_EDIT_TEAM = AJV_VALIDATOR.compile(EDIT_TEAM_SCHEMA);

function readData() {

    let data;

    try {

        data = fs.readFileSync(DATA_ROUTE, 'utf8');
    } catch (error) {

        fs.writeFileSync(DATA_ROUTE, '[]');
        return [];

    }

    let teams = JSON.parse(data);

    return teams;
}

function getTeamByName(name) {

    let teamsList = readData();
    let team = teamsList.find(teamData => teamData.teamName.toLowerCase() === name.toLowerCase());

    if (team) {

        return { team }
    } else {

        return { error_message: "Team Not Found" }
    }
}

function writeTeam(data) {

    try {

        fs.writeFileSync(DATA_ROUTE, JSON.stringify(data, null, 2));

    } catch (err) {

        return { error_message: "Failed to save Team" };
    }

}

function registerNewTeam(body) {

    let validator = VALIDATE_TEAM(body);

    if (!validator) {

        return { error_message: "Invlid input format" }
    }

    let members = validateMembers(body.playerNames);

    if (body.teamName.trim() === "" || body.cityTeam.trim() === "" || !members) {

        return { error_message: "Some field are empty, please fill it!" }
    }

    let teamsList = readData();
    let team = teamsList.find(teamData => teamData.teamName.toLowerCase() === body.teamName.toLowerCase());

    if ( team ) {

        return { error_message: "That team already exists, use another name" }
    }

    let newTeam = {

        teamName: body.teamName,
        cityTeam: body.cityTeam,
        playerNames: body.playerNames
    };

    teamsList.push(newTeam);

    writeTeam(teamsList);

    return { newTeam };
}

function editAllTeamData(name, body) {

    let validator = VALIDATE_TEAM(body);

    if (!validator) {

        return { error_message: "Invlid input format" }
    }

    let members = validateMembers(body.playerNames);

    if (body.teamName.trim() === "" || body.cityTeam.trim() === "" || !members) {

        return { error_message: "Some field are empty, please fill it!" }
    }

    let teamsList = readData();
    let teamIndex = teamsList.findIndex(teamData => teamData.teamName === name);
    let team = teamsList.find(teamData => teamData.teamName.toLowerCase() === name.toLowerCase());
    let teamName = teamsList.find(teamData => teamData.teamName.toLowerCase() === body.teamName.toLowerCase());

    if ( team.teamName.trim().toLowerCase() === body.teamName.trim().toLowerCase() || 
    team.cityTeam.trim().toLowerCase() === body.cityTeam.trim().toLowerCase() ) {

        return { error_message: "Nothing change" }
    }

    if ( teamName ) {

        return { error_message: "that team already exists, use another name" }
    }

    if ( teamIndex !== -1 ) {

        let updateTeamData = {

            teamName: body.teamName,
            cityTeam: body.cityTeam,
            playerNames: body.playerNames
        };

        teamsList[teamIndex] = updateTeamData;

        writeTeam(teamsList);
        
        return { updateTeamData };
    } else {

        return { error_message: "Team not found" }
    }
}

function editSomeTeamData(name, body) {

    let validator = VALIDATE_EDIT_TEAM(body);

    if (!validator) {

        return { error_message: "Invlid input format" };
    }

    let members = validateMembers(body.playerNames);

    if (body.teamName.trim() === "" || body.cityTeam.trim() === "" || !members) {

        return { error_message: "Some field are empty, please fill it!" };
    }

    let teamsList = readData();
    let teamIndex = teamsList.findIndex(teamData => teamData.teamName === name);
    let team = teamsList.find(teamData => teamData.teamName.toLowerCase() === name.toLowerCase());
    let teamName = teamsList.find(teamData => teamData.teamName.toLowerCase() === body.teamName.toLowerCase());

    if ( teamName ) {

        return { error_message: "That team already exists, use another name" };
    }

    if ( teamIndex === -1 ) {

        return { error_message: "Team not found" }
    }

    let editTeam = {

        teamName: body.teamName ? body.teamName : team.teamName,
        cityTeam: body.cityTeam ? body.cityTeam : team.cityTeam,
        playerNames: body.playerNames ? body.playerNames : team.playerNames
    }

    if ( team.teamName.trim().toLowerCase() === editTeam.teamName.trim().toLowerCase() && 
    team.cityTeam.trim().toLowerCase() === editTeam.cityTeam.trim().toLowerCase() ) {

        return { error_message: "Nothing to change"}
    }

    teamsList[teamIndex] = editTeam;

    writeTeam(teamsList);

    return { editTeam };

}

function deleteTeam(name) {

    let teamsList = readData();
    let teamIndex = teamsList.findIndex(teamData => teamData.teamName === name);

    if ( teamIndex !== -1 ) {

        teamsList.splice(teamIndex, 1);

        writeTeam(teamsList);

        return { message: "Team deleted" }
    } else {

        return { error_message: "Team not found" }
    }
}

function validateMembers(membersList) {

    for (let member of membersList) {

        if (member.trim() === ""){

            return false;
        }
    }

    return true;
}

module.exports = { readData, getTeamByName, registerNewTeam, editAllTeamData, editSomeTeamData, deleteTeam };