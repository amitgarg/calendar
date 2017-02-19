function getMeetingAttributes(meetings) {
  var times = [];
  var start = [];
  var end = [];
  meetings.sort(function (a, b) {
    return a.start - b.start;
  })
  meetings.forEach(function (meeting) {
    start.push({
      meeting: meeting,
      type: 'start',
    });
    end.push({
      meeting: meeting,
      type: 'end',
    });
  });
  times = end.concat(start);
  times.sort(function (a, b) {
    return a.meeting[a.type] - b.meeting[b.type];
  })
  var counter = 0;
  var i = 0;
  while (i < times.length) {
    let max = counter;
    let startIndex = i;
    for (; i < times.length; i++) {
      var time = times[i];
      if (time.type == 'start') {
        counter++;
        if (max < counter) {
          max = counter;
        }
      } else {
        counter--;
        if (counter == 0) {
          i++;
          break;
        }
      }
    }

    let array = new Array(max);
    let runningIndex = 0;
    for (var j = startIndex; j < i; j++) {
      var time = times[j];
      if (time.type == 'start') {
        let behindIndex = runningIndex - 1;
        while (behindIndex >= 0 && !array[behindIndex]) {
          behindIndex--;
        }
        if (array[behindIndex]) {
          array[behindIndex].maxLength = runningIndex - array[behindIndex].index;
        }
        time.meeting.index = runningIndex;
        time.meeting.max = max;
        array[runningIndex++] = time.meeting;
        let maxLength = 1;
        if (array[runningIndex]) {
          while (array[runningIndex]) {
            runningIndex++;
          }
        } else {
          let index = runningIndex;
          while (index < max && !array[index++]) {
            maxLength++;
          }
        }

        time.meeting.maxLength = maxLength;
      } else {
        let index = time.meeting.index;
        array[index] = undefined;
        if (runningIndex > index) {
          runningIndex = index;
        }
        let length = 1;
        while (!array[++index] && index < max && index < runningIndex + time.meeting.maxLength) {
          length++;
        }
        time.meeting.length = length;
      }
    }
  }
  return meetings.map(function (meeting) {
    let max = meeting.max;
    return {
      id: meeting.id,
      start: meeting.start,
      end: meeting.end,
      top: (meeting.start * 2) + 'px',
      left: (meeting.index * 600 / meeting.max) + 'px',
      width: (meeting.length * 600 / meeting.max) + 'px',
      height: (meeting.end - meeting.start) * 2 + 'px'
    }
  })
}

//------------------------TEST DATA ----------------------------------
var data1 = [
  [123, 120, 180],
  [124, 60, 120],
  [234, 90, 150]
];
var data2 = [
  [1, 0, 120],
  [2, 30, 150],
  [3, 60, 180],
  [4, 120, 240]
]; //3 blocks
var data3 = [
  [1, 0, 120],
  [2, 30, 150],
  [3, 60, 180],
  [4, 150, 270]
]; //3 blocks
var data4 = [
  [1, 0, 120],
  [2, 30, 150],
  [3, 60, 180],
  [4, 150, 270],
  [5, 150, 270]
]; //3 blocks
var data5 = [
  [1, 0, 120],
  [2, 30, 150],
  [3, 60, 180],
  [4, 150, 270],
  [5, 150, 270],
  [6, 150, 270]
]; //4 blocks
var data6 = [
  [1, 0, 120],
  [2, 30, 150],
  [3, 60, 180],
  [4, 150, 270],
  [5, 150, 270],
  [6, 150, 270],
  [7, 150, 270]
]; //5 blocks
var data7 = [
  [1, 0, 120],
  [2, 30, 150],
  [3, 60, 180],
  [4, 150, 270],
  [5, 150, 270],
  [6, 150, 270],
  [7, 150, 270],
  [8, 180, 300]
];
var data8 = [
  [1, 0, 120],
  [2, 30, 150],
  [3, 60, 180],
  [4, 180, 300],
  [5, 180, 300]
];
var data9 = [
  [1, 0, 120],
  [2, 30, 150],
  [3, 60, 240],
  [4, 170, 300],
  [5, 210, 230]
];
var data10 = [
  [1, 0, 120],
  [2, 30, 150],
  [3, 60, 240],
  [4, 170, 300],
  [5, 250, 280]
];
var data11 = [
  [1, 60, 150],
  [2, 540, 570],
  [3, 555, 600],
  [4, 585, 660]
];

//choose particular data object to test
var testMeetings = data9.map(function (info) {
    return {
      id: info[0],
      start: info[1],
      end: info[2]
    };
  })
//------------------------- TEST DATA END ------------------------
  // console.log(getMeetingAttributes(meetings));

var meetings = [{
  id: 1,
  start: 60,
  end: 150
}, {
  id: 2,
  start: 540,
  end: 570
}, {
  id: 3,
  start: 555,
  end: 600
}, {
  id: 4,
  start: 585,
  end: 660
}];


//pass testMeetings instead of meetings to test a particular case
var attributes = getMeetingAttributes(meetings);

var $calendar = document.getElementById('calendar-area');
attributes.forEach(function (attr) {
  let node = document.createElement("DIV");
  node.style.width = attr.width;
  node.style.top = attr.top;
  node.style.left = attr.left;
  node.style.height = attr.height;
  node.className = 'meeting';
  node.innerHTML = '<span>Meeting : ' + attr.id + '</span>'
  $calendar.appendChild(node);
})