const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
/*
function checkPhone(data) {
    return admin.database().ref('/users').child(data).on('value', (snapshot) => {
        console.log(snapshot.val());

    })

}*/
exports.webhook = functions.https.onRequest((request, response) => {


    var action = request.body.result.action;
    if (action === 'needTutor') {

        var teachers = [];
        var teacherDocsValues = ``;

        var paramSubject = request.body.result.parameters.tutorSubject;
        admin.database().ref('/tutors').orderByChild('subject').equalTo(`${paramSubject.toLowerCase()}`)
            .on('value', (snapshot) => {

                snapshot.forEach((data) => {
                    teachers.push(data.val());
                });

                teachers.forEach(teacherDoc => {
                    teacherDocsValues += `${teacherDoc.name}#${teacherDoc.subject}#${teacherDoc.salary}#${teacherDoc.image}#`;
                })
                //console.log('teachers array', teachers);

                //response.send({ speech: teacherDocsValues });

                console.log('data _ teachers -->', teachers);
                console.log('speech_ teachersValues -->', teacherDocsValues);

                response.send({
                    "speech": JSON.stringify({
                        "data": teachers,
                        "text": teacherDocsValues
                    })
                });

            })
    }
    else if (action === 'studentInfo') {

        console.log('inside basic info action');
        var params = request.body.result.parameters;
        var hobbies = params.hobbies;
        var schoolName = params.schoolName;
        var highSchoolDegree = params.highSchoolDegree;

        console.log('parameters', hobbies, schoolName, highSchoolDegree);
        if (hobbies && schoolName && highSchoolDegree) {
            admin.database().ref('/info').push({
                'hobbies': hobbies,
                'schoolName': schoolName,
                'highSchoolDegree': highSchoolDegree
            })
                .on('value', (snapshot) => {
                    console.log('Data pushed successfully!');
                });
        }

    }

    /*else {
        response.send({ speech: `undefined action` });
    }*/
});
