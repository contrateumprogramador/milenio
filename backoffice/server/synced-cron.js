// // Prepara Batalhas do dia seguinte
// SyncedCron.add({
//     name: 'Propostas Expiradas',
//     schedule: function(parser) {
//         return parser.text('at 00:00 am');
//     },
//     job: function() {
//         Meteor.sleep(1000);
//         return Proposals.update({
//             validity: {
//                 $lte: new Date()
//             },
//             status: 0
//         }, {
//             $set: {
//                 status: -1
//             }
//         }, {
//             multi: 1
//         });
//     }
// });

// SyncedCron.start();