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

                    //Debug cases
                    //console.log('data.key', data.key)
                    //console.log('paramSubject', paramSubject);
                    //console.log('teachers array', teachers);

                });

                teachers.forEach(teacherDoc => {
                    teacherDocsValues += `${teacherDoc.name}#${teacherDoc.subject}#${teacherDoc.salary}#${teacherDoc.image}#`;
                })
                //console.log('teachers array', teachers);

                //response.send({ speech: teacherDocsValues });

                /*response.send(
                    {
                        "speech": "Hmm hai ",
                        "displayText": " I will catch you",
                        "data": { "name": "Abhay" },
                        "contextOut": teachers,
                        //"source": "DigiFlow"
                    });*/
                    console.log('data _ teachers -->', teachers);
                    console.log('speech_ teachersValues -->', teacherDocsValues);
                    
                    
                response.send({ "data": teachers, "speech":teacherDocsValues });

            })
    }

    else {
        response.send({ speech: `undefined action` });
    }
});
