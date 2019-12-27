/** 
 * @file
 * @brief   sleepchart.js
 * @details Read lifelog file and rendering sleepchart.
 * @author  Koichi OKADA
 * @date    2019
 * @copyright the MIT license
 */

const DAY=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

/**
 * Rendering sleeplog.
 * @param {*} sleeplog
 * 
 * @details
 * sleeplog is 2 dimentional array
 * which stores state as sleeplog[date][time] = state;.
 * Here the `date` is minuts from the epoch (1970-01-01 UTC)
 * and the `time` is minuts from 00:00 in a day.
 */
function rendering(sleeplog)
{
  let scale = 1/4;
  console.log(sleeplog);
  let sleepchart = document.createElement("div");
  sleepchart.classList.add("sleepchart");
  document.body.appendChild(sleepchart);
  let t0 = Date.parse("1970/01/01 00:00:00") / 60000;
  let header;
  {
    let day = sleepchart.appendChild(header = document.createElement("div"));
    let label = day.appendChild(document.createElement("div"));
    let rulerbase = day.appendChild(document.createElement("div"));
    label.appendChild(document.createTextNode("Date"));
    day.classList.add("day", "header");
    day.style.position = "sticky";
    day.style.top = 0;
    label.classList.add("label")
    rulerbase.classList.add("rulerbase")
    rulerbase.style.width = `${1440 * scale}px`;
    for (let i = 0; i < 24; i++) {
      let ruler = document.createElement("div");
      ruler.classList.add("ruler", `_${strftime("%H%M", new Date((t0 + i * 60) * 60000))}`);
      ruler.style.width = `${60 * scale - 1}px`;
      ruler.title = `${strftime("%H:%M", new Date((t0 + i * 60) * 60000))}`;
      rulerbase.appendChild(ruler);
    }
    day.appendChild(rulerbase.cloneNode(true));
  }
  
  sleeplog.forEach((log, date)=>{
    console.log(strftime("%F", new Date(date * 60000)));
    let datetime1, datetime2;
    let state1, state2;
    let day = sleepchart.appendChild(document.createElement("div"));
    let label = day.appendChild(document.createElement("div"));
    let stateblock = day.appendChild(document.createElement("div"));
    let gridbase = stateblock.appendChild(document.createElement("div"));
    label.appendChild(document.createTextNode(strftime("%F", new Date(date * 60000))));
    day.classList.add("day");
    label.classList.add("label")
    label.classList.add(DAY[(new Date(date * 60000)).getDay()]);
    stateblock.classList.add("state")
    stateblock.classList.add(DAY[(new Date(date * 60000)).getDay()])
    stateblock.style.width = `${1440 * scale}px`;
    gridbase.classList.add("gridbase");
    gridbase.style.width = `${1440 * scale}px`;
    for (let i = 0; i < 24; i++) {
      let grid = document.createElement("div");
      grid.classList.add("grid", `_${strftime("%H%M", new Date((t0 + i * 60) * 60000))}`);
      grid.style.width = `${60 * scale - 1}px`;
      gridbase.appendChild(grid);
    }
    log.forEach((state, time)=>{
      datetime2 = datetime1;
      datetime1 = date + time;
      console.log(strftime("%H:%M", new Date(datetime1 * 60000)) + ` ${state}`);
      state2 = state1;
      state1 = state;
      if (datetime2 != undefined) {
        let st = document.createElement("div");
        st.classList.add(state2);
        st.style.width = `${(datetime1 - datetime2) * scale}px`;
        st.title = `${strftime("%H:%M", new Date(datetime2 * 60000))}-${strftime("%H:%M", new Date(datetime1 * 60000))}(${utcstrftime("%H:%M", new Date((datetime1-datetime2) * 60000))})`;
        stateblock.appendChild(st);
      }
    });
    if (day.previousSibling && day.previousSibling.previousSibling) {
      day.previousSibling.appendChild(stateblock.cloneNode(true));
    }
    laststate = state2;
  });

  let footer = header.cloneNode(true)
  footer.classList.replace("header", "footer");
  sleepchart.appendChild(footer);
}

/**
 * Call back at file loaded.
 * @param {*} e    - Event object 
 * @param {*} file - File object
 */
function onLoadFile(e, file) {
  //console.log(e.target.result);
  let lines = e.target.result.split(/\r\n|\n|\r/);
  let yyyymmdd1, yyyymmdd2, hhmm1, hhmm2;
  let date1, date2, time1, time2, datetime1, datetime2;
  let state1, state2;
  let state1time = 0, state2time;
  let log, logex;
  let sleeplog = [];
  lines.some((s, i)=>{
    if (s.match(/^END$/)) {
      return true;
    } else if (s.match(/^(([0-9]{4})([0-9]{2})([0-9]{2}))[ \t]*$/)) {
      yyyymmdd2 = yyyymmdd1;
      yyyymmdd1 = RegExp.$1;
      date2 = date1;
      date1 = Date.parse(`${RegExp.$2}/${RegExp.$3}/${RegExp.$4}`);
      if (date2 != undefined && date1 - date2 != 86400000) {
        console.error(`Incontinuous date sequence: ${yyyymmdd2}(@${date2} to ${yyyymmdd1}(@${date1}) at line ${i + 1}.`);
      }
      if (yyyymmdd2 != undefined) {
        sleeplog[date2 / 60000][1440] = state1;
      }
      sleeplog[date1 / 60000] = [];
      state1time = time1 = 0;
//      state1 = state2 = undefined;
    } else if (s.match(/^(([0-9]{2})([0-9]{2}))(\t(([swoLh])([?,、](.*))?))?[ ]*$/)) {
      hhmm2 = hhmm1;
      hhmm1 = RegExp.$1;
      h = parseInt(RegExp.$2, 10);
      m = parseInt(RegExp.$3, 10);
      time2 = time1;
      time1 = (h * 60 + m) * 60 * 1000;
      log   = RegExp.$6;
      logex = RegExp.$7;
      if (time2 != undefined) {
        datetime2 = date1 + time2;
        datetime1 = date1 + time1;
        if (datetime1 < datetime2) {
          console.error(`Incorrect time sequence: MJD: ${hhmm2} to ${hhmm1} at line ${i + 1}.`);
        }
      }
      if (log == "s" || log == "w") {
        state2time = state1time;
        state1time = time1;
        state2 = state2 == undefined ? (log == "s" ? "w" : "s") : state1;
        state1 = log;
        sleeplog[date1 / 60000][state2time / 60000] = state2;
        sleeplog[date1 / 60000][state1time / 60000] = state1;
      }
    }
    return false;
  });
  rendering(sleeplog);
  console.log(sleeplog);
  return 0;
}

window.addEventListener("load", ()=>{
  let e = document.querySelectorAll(".file_droppable");
  [].forEach.call(e, e=>FileDroppable.attach(e, {filereaderload: onLoadFile}));
  FileDroppable.attach(document.body, {filereaderload: onLoadFile});
});
