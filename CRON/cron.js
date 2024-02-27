var CRON = require('node-cron');

CRON.schedule('*/10 * * * *', async () => {
     var dbData = await trainingDB.find();
     var currentTimeStamp = new Date().getTime() / 1000;
     currentTimeStamp = currentTimeStamp.toString();
     var split_currentTimeStamp = currentTimeStamp.split(".");
     currentTimeStamp = split_currentTimeStamp[0];

     dbData.map((data, i) => {
          var dbTimeStamp = data.timeStamp;
          var duration = 864000
          var id = data._id;
          var age = data.age;
          age = age + 1;
          var updatedAge = age;
          dbUpdateTimeStamp = dbTimeStamp + duration;

          if (currentTimeStamp > dbUpdateTimeStamp) {
               trainingDB.updateOne({ _id: id }, { $set: { timeStamp: dbUpdateTimeStamp, age: updatedAge } }, (err, result) => {
                    if (err) {
                         console.log(err);
                    } else {
                         console.log('Success')
                    }
               })
          }
     })
})
// 



