/**
 * returns chartjs config
 */
function chart(
  labels,
  datasetsLength,
  datasetLabels,
  datasetData,
  datasetBGC,
  datasetBorC,
  datasetHoverOffset,
  chart,
  options
) {
  let datasets = [];
  for (let i = 0; i < datasetsLength; i++) {
    datasets.push({
      label: datasetLabels[i],
      data: datasetData[i],
      backgroundColor: datasetBGC[i],
      borderColor: datasetBorC[i],
      borderWidth: 1,
      hoverOffset: datasetHoverOffset,
      fill: true,
      tension: 0.1,
    });
  }
  const config = {
    type: chart,
    data: {
      labels,
      datasets,
    },
    options,
  };
  return config;
}
/**
 * used by performance satisfaction strings
 */
function strToRate(str) {
  switch (str) {
    case "Extremely Fair":
    case "Extremely Well":
    case "Extremely Easy":
    case "Always":
      return 1;
    case "Very Fairly":
    case "Very Well":
    case "Very Easy":
      return 0.8;
    case "Most Of The Time":
      return 0.75;
    case "Somewhat Fairly":
    case "Somewhat Well":
    case "Somewhat Easy":
      return 0.6;
    case "Once In A While":
      return 0.5;
    case "Not So Easy":
    case "Not So Well":
    case "Not So Fairly":
      return 0.4;
    case "Not At All Easy":
    case "Not At All Well":
    case "Not At All Fairly":
      return 0.2;
    case "Never":
      return 0;
    default:
      console.error("strToRate function error");
  }
}
/**
 * formats array to bar chart data
 *
 * variant: trainEval -> maps out data and returns an array of divided program values
 *
 * variant: satisfactionData -> maps out data and returns an array of objects containing cycleId and formData: an array of numbers calculated based on the survey answers
 *
 * variant: satisfactionCompress -> maps out data.cycleIdsArrGlobal: maps out data.satisfactionDataFormatted: adding corresponding data and dividing them by their calculated divider variable -> returns an array of array of numbers XD ehe
 *
 * variant: satisfactionLabels -> maps out data.cycleIdsArrGlobal: everys out data.cycleObjGlobal stopping when cycle id matches and pushes the label to the return data array -> returns an array of strings
 *
 */
function formatChartData(data, variant) {
  let returnData = new Array();
  switch (variant) {
    case "trainEval":
      data.map((d) => {
        returnData.push([
          d.programUsefulness / d.count,
          d.programAdequacy / d.count,
          d.programSkillsPractice / d.count,
          d.programInstructorKnowledge / d.count,
          d.programInstructorDelivery / d.count,
          d.programFacility / d.count,
          d.programAVSupport / d.count,
          d.programLectureNotes / d.count,
          d.programDuration / d.count,
        ]);
      });
      return returnData;
    case "satisfactionData":
      data.map((d) => {
        returnData.push({
          cycleId: d.cycleId,
          formData: [
            100 *
              (d.rolesRespoAreClear === "Yes"
                ? 1
                : d.rolesRespoAreClear === "Partially"
                ? 0.5
                : 0),
            100 * (d.enoughOpporToExploSkills === "Yes" ? 1 : 0),
            100 * strToRate(d.treatment),
            100 * strToRate(d.recognition),
            100 * strToRate(d.workLifeBalance),
            100 * (d.superGaveEnouOppor === "Yes" ? 1 : 0),
            100 * strToRate(d.teamwork),
          ],
        });
      });
      return returnData;
    case "satisfactionCompress":
      const { satisfactionDataFormatted, cycleIdsArrGlobal } = data;
      cycleIdsArrGlobal.map((c, ci) => {
        returnData.push([0, 0, 0, 0, 0, 0, 0]);
        let divider = 0;
        satisfactionDataFormatted.map((s, si) => {
          if (s.cycleId === c) {
            ++divider;
            s.formData.map((fd, fdi) => {
              returnData[ci][fdi] += fd;
            });
            returnData[ci].map((val, index) => {
              returnData[ci][index] = val / divider;
            });
          }
        });
      });
      return returnData;
    case "satisfactionLabels":
      data.cycleIdsArrGlobal.map((d, di) => {
        data.cycleObjGlobal.every((c, ci) => {
          if (c.cycleId === d) {
            returnData.push(`${c.pos} ${c.cycType} Cycle`);
            return false;
          }
          return true;
        });
      });
      return returnData;
    default:
      return [];
  }
}

// chart colors
const RED = "255, 99, 132";
const BLUE = "54, 162, 235";
const YELLOW = "255, 206, 86";
const BROWN = "112, 53, 4";
const PURPLE = "157, 10, 255";
const PINK = "255, 10, 235";
const GREEN = "10, 255, 22";
const VIOLET = "15, 0, 125";
const CYAN = "10, 255, 235";
const DARKRED = "59, 4, 0";
const DARKPINK = "59, 0, 48";
const ORANGE = "255, 162, 0";
const DARKGREEN = "10, 61, 0";
const NAVYBLUE = "3, 0, 61";
const DARKCYAN = "0, 61, 50";
const DARKYELLOW = "61, 60, 0";
const RED255 = "255, 0, 0";
const ORANGE255 = "255, 128, 0";
const YELLOW255 = "255, 230, 0";
const GREEN255 = "0, 255, 13";
const CYAN255 = "0, 234, 255";
const BLUE255 = "0, 0, 255";
const PURPLE255 = "98, 0, 255";
const PINK255 = "225, 0, 255";

/**
 * gives doughnut/polararea chart colors
 * supports 4 legends
 *
 */
const pieBGC = [
  [
    `rgb(${DARKYELLOW}, 0.2)`,
    `rgb(${GREEN}, 0.2)`,
    `rgb(${ORANGE255}, 0.2)`,
    `rgb(${VIOLET}, 0.2)`,
  ],
];
const pieBorC = [
  [
    `rgb(${DARKYELLOW})`,
    `rgb(${GREEN})`,
    `rgb(${ORANGE255})`,
    `rgb(${VIOLET})`,
  ],
];
/**
 * gives bar chart colors
 * supports 144 legends
 *
 */
const barBGC = [
  [`rgb(${DARKGREEN}, 0.2)`],
  [`rgb(${NAVYBLUE}, 0.2)`],
  [`rgba(${PINK}, 0.2)`],
  [`rgb(${DARKRED}, 0.2)`],
  [`rgb(${DARKYELLOW}, 0.2)`],
  [`rgb(${PINK255}, 0.2)`],
  [`rgb(${BLUE255}, 0.2)`],
  [`rgba(${YELLOW}, 0.2)`],
  [`rgb(${PURPLE255}, 0.2)`],
  [`rgb(${ORANGE}, 0.2)`],
  [`rgb(${RED255}, 0.2)`],
  [`rgb(${PURPLE}, 0.2)`],
  [`rgb(${CYAN255}, 0.2)`],
  [`rgb(${GREEN}, 0.2)`],
  [`rgb(${ORANGE255}, 0.2)`],
  [`rgb(${VIOLET}, 0.2)`],
  [`rgb(${YELLOW255}, 0.2)`],
  [`rgb(${GREEN255}, 0.2)`],
  [`rgba(${CYAN}, 0.2)`],
  [`rgb(${BLUE}, 0.2)`],
  [`rgb(${RED}, 0.2)`],
  [`rgb(${DARKCYAN}, 0.2)`],
  [`rgb(${DARKPINK}, 0.2)`],
  [`rgb(${BROWN}, 0.2)`],
  [`rgb(${DARKGREEN}, 0.2)`],
  [`rgb(${NAVYBLUE}, 0.2)`],
  [`rgba(${PINK}, 0.2)`],
  [`rgb(${DARKRED}, 0.2)`],
  [`rgb(${DARKYELLOW}, 0.2)`],
  [`rgb(${PINK255}, 0.2)`],
  [`rgb(${BLUE255}, 0.2)`],
  [`rgba(${YELLOW}, 0.2)`],
  [`rgb(${PURPLE255}, 0.2)`],
  [`rgb(${ORANGE}, 0.2)`],
  [`rgb(${RED255}, 0.2)`],
  [`rgb(${PURPLE}, 0.2)`],
  [`rgb(${CYAN255}, 0.2)`],
  [`rgb(${GREEN}, 0.2)`],
  [`rgb(${ORANGE255}, 0.2)`],
  [`rgb(${VIOLET}, 0.2)`],
  [`rgb(${YELLOW255}, 0.2)`],
  [`rgb(${GREEN255}, 0.2)`],
  [`rgba(${CYAN}, 0.2)`],
  [`rgb(${BLUE}, 0.2)`],
  [`rgb(${RED}, 0.2)`],
  [`rgb(${DARKCYAN}, 0.2)`],
  [`rgb(${DARKPINK}, 0.2)`],
  [`rgb(${BROWN}, 0.2)`],
  [`rgb(${DARKGREEN}, 0.2)`],
  [`rgb(${NAVYBLUE}, 0.2)`],
  [`rgba(${PINK}, 0.2)`],
  [`rgb(${DARKRED}, 0.2)`],
  [`rgb(${DARKYELLOW}, 0.2)`],
  [`rgb(${PINK255}, 0.2)`],
  [`rgb(${BLUE255}, 0.2)`],
  [`rgba(${YELLOW}, 0.2)`],
  [`rgb(${PURPLE255}, 0.2)`],
  [`rgb(${ORANGE}, 0.2)`],
  [`rgb(${RED255}, 0.2)`],
  [`rgb(${PURPLE}, 0.2)`],
  [`rgb(${CYAN255}, 0.2)`],
  [`rgb(${GREEN}, 0.2)`],
  [`rgb(${ORANGE255}, 0.2)`],
  [`rgb(${VIOLET}, 0.2)`],
  [`rgb(${YELLOW255}, 0.2)`],
  [`rgb(${GREEN255}, 0.2)`],
  [`rgba(${CYAN}, 0.2)`],
  [`rgb(${BLUE}, 0.2)`],
  [`rgb(${RED}, 0.2)`],
  [`rgb(${DARKCYAN}, 0.2)`],
  [`rgb(${DARKPINK}, 0.2)`],
  [`rgb(${BROWN}, 0.2)`],
  [`rgb(${DARKGREEN}, 0.2)`],
  [`rgb(${NAVYBLUE}, 0.2)`],
  [`rgba(${PINK}, 0.2)`],
  [`rgb(${DARKRED}, 0.2)`],
  [`rgb(${DARKYELLOW}, 0.2)`],
  [`rgb(${PINK255}, 0.2)`],
  [`rgb(${BLUE255}, 0.2)`],
  [`rgba(${YELLOW}, 0.2)`],
  [`rgb(${PURPLE255}, 0.2)`],
  [`rgb(${ORANGE}, 0.2)`],
  [`rgb(${RED255}, 0.2)`],
  [`rgb(${PURPLE}, 0.2)`],
  [`rgb(${CYAN255}, 0.2)`],
  [`rgb(${GREEN}, 0.2)`],
  [`rgb(${ORANGE255}, 0.2)`],
  [`rgb(${VIOLET}, 0.2)`],
  [`rgb(${YELLOW255}, 0.2)`],
  [`rgb(${GREEN255}, 0.2)`],
  [`rgba(${CYAN}, 0.2)`],
  [`rgb(${BLUE}, 0.2)`],
  [`rgb(${RED}, 0.2)`],
  [`rgb(${DARKCYAN}, 0.2)`],
  [`rgb(${DARKPINK}, 0.2)`],
  [`rgb(${BROWN}, 0.2)`],
  [`rgb(${DARKGREEN}, 0.2)`],
  [`rgb(${NAVYBLUE}, 0.2)`],
  [`rgba(${PINK}, 0.2)`],
  [`rgb(${DARKRED}, 0.2)`],
  [`rgb(${DARKYELLOW}, 0.2)`],
  [`rgb(${PINK255}, 0.2)`],
  [`rgb(${BLUE255}, 0.2)`],
  [`rgba(${YELLOW}, 0.2)`],
  [`rgb(${PURPLE255}, 0.2)`],
  [`rgb(${ORANGE}, 0.2)`],
  [`rgb(${RED255}, 0.2)`],
  [`rgb(${PURPLE}, 0.2)`],
  [`rgb(${CYAN255}, 0.2)`],
  [`rgb(${GREEN}, 0.2)`],
  [`rgb(${ORANGE255}, 0.2)`],
  [`rgb(${VIOLET}, 0.2)`],
  [`rgb(${YELLOW255}, 0.2)`],
  [`rgb(${GREEN255}, 0.2)`],
  [`rgba(${CYAN}, 0.2)`],
  [`rgb(${BLUE}, 0.2)`],
  [`rgb(${RED}, 0.2)`],
  [`rgb(${DARKCYAN}, 0.2)`],
  [`rgb(${DARKPINK}, 0.2)`],
  [`rgb(${BROWN}, 0.2)`],
  [`rgb(${DARKGREEN}, 0.2)`],
  [`rgb(${NAVYBLUE}, 0.2)`],
  [`rgba(${PINK}, 0.2)`],
  [`rgb(${DARKRED}, 0.2)`],
  [`rgb(${DARKYELLOW}, 0.2)`],
  [`rgb(${PINK255}, 0.2)`],
  [`rgb(${BLUE255}, 0.2)`],
  [`rgba(${YELLOW}, 0.2)`],
  [`rgb(${PURPLE255}, 0.2)`],
  [`rgb(${ORANGE}, 0.2)`],
  [`rgb(${RED255}, 0.2)`],
  [`rgb(${PURPLE}, 0.2)`],
  [`rgb(${CYAN255}, 0.2)`],
  [`rgb(${GREEN}, 0.2)`],
  [`rgb(${ORANGE255}, 0.2)`],
  [`rgb(${VIOLET}, 0.2)`],
  [`rgb(${YELLOW255}, 0.2)`],
  [`rgb(${GREEN255}, 0.2)`],
  [`rgba(${CYAN}, 0.2)`],
  [`rgb(${BLUE}, 0.2)`],
  [`rgb(${RED}, 0.2)`],
  [`rgb(${DARKCYAN}, 0.2)`],
  [`rgb(${DARKPINK}, 0.2)`],
  [`rgb(${BROWN}, 0.2)`],
];
const barBorC = [
  [`rgb(${DARKGREEN})`],
  [`rgb(${NAVYBLUE})`],
  [`rgba(${PINK})`],
  [`rgb(${DARKRED})`],
  [`rgb(${DARKYELLOW})`],
  [`rgb(${PINK255})`],
  [`rgb(${BLUE255})`],
  [`rgba(${YELLOW})`],
  [`rgb(${PURPLE255})`],
  [`rgb(${ORANGE})`],
  [`rgb(${RED255})`],
  [`rgb(${PURPLE})`],
  [`rgb(${CYAN255})`],
  [`rgb(${GREEN})`],
  [`rgb(${ORANGE255})`],
  [`rgb(${VIOLET})`],
  [`rgb(${YELLOW255})`],
  [`rgb(${GREEN255})`],
  [`rgba(${CYAN})`],
  [`rgb(${BLUE})`],
  [`rgb(${RED})`],
  [`rgb(${DARKCYAN})`],
  [`rgb(${DARKPINK})`],
  [`rgb(${BROWN})`],
  [`rgb(${DARKGREEN})`],
  [`rgb(${NAVYBLUE})`],
  [`rgba(${PINK})`],
  [`rgb(${DARKRED})`],
  [`rgb(${DARKYELLOW})`],
  [`rgb(${PINK255})`],
  [`rgb(${BLUE255})`],
  [`rgba(${YELLOW})`],
  [`rgb(${PURPLE255})`],
  [`rgb(${ORANGE})`],
  [`rgb(${RED255})`],
  [`rgb(${PURPLE})`],
  [`rgb(${CYAN255})`],
  [`rgb(${GREEN})`],
  [`rgb(${ORANGE255})`],
  [`rgb(${VIOLET})`],
  [`rgb(${YELLOW255})`],
  [`rgb(${GREEN255})`],
  [`rgba(${CYAN})`],
  [`rgb(${BLUE})`],
  [`rgb(${RED})`],
  [`rgb(${DARKCYAN})`],
  [`rgb(${DARKPINK})`],
  [`rgb(${BROWN})`],
  [`rgb(${DARKGREEN})`],
  [`rgb(${NAVYBLUE})`],
  [`rgba(${PINK})`],
  [`rgb(${DARKRED})`],
  [`rgb(${DARKYELLOW})`],
  [`rgb(${PINK255})`],
  [`rgb(${BLUE255})`],
  [`rgba(${YELLOW})`],
  [`rgb(${PURPLE255})`],
  [`rgb(${ORANGE})`],
  [`rgb(${RED255})`],
  [`rgb(${PURPLE})`],
  [`rgb(${CYAN255})`],
  [`rgb(${GREEN})`],
  [`rgb(${ORANGE255})`],
  [`rgb(${VIOLET})`],
  [`rgb(${YELLOW255})`],
  [`rgb(${GREEN255})`],
  [`rgba(${CYAN})`],
  [`rgb(${BLUE})`],
  [`rgb(${RED})`],
  [`rgb(${DARKCYAN})`],
  [`rgb(${DARKPINK})`],
  [`rgb(${BROWN})`],
  [`rgb(${DARKGREEN})`],
  [`rgb(${NAVYBLUE})`],
  [`rgba(${PINK})`],
  [`rgb(${DARKRED})`],
  [`rgb(${DARKYELLOW})`],
  [`rgb(${PINK255})`],
  [`rgb(${BLUE255})`],
  [`rgba(${YELLOW})`],
  [`rgb(${PURPLE255})`],
  [`rgb(${ORANGE})`],
  [`rgb(${RED255})`],
  [`rgb(${PURPLE})`],
  [`rgb(${CYAN255})`],
  [`rgb(${GREEN})`],
  [`rgb(${ORANGE255})`],
  [`rgb(${VIOLET})`],
  [`rgb(${YELLOW255})`],
  [`rgb(${GREEN255})`],
  [`rgba(${CYAN})`],
  [`rgb(${BLUE})`],
  [`rgb(${RED})`],
  [`rgb(${DARKCYAN})`],
  [`rgb(${DARKPINK})`],
  [`rgb(${BROWN})`],
  [`rgb(${DARKGREEN})`],
  [`rgb(${NAVYBLUE})`],
  [`rgba(${PINK})`],
  [`rgb(${DARKRED})`],
  [`rgb(${DARKYELLOW})`],
  [`rgb(${PINK255})`],
  [`rgb(${BLUE255})`],
  [`rgba(${YELLOW})`],
  [`rgb(${PURPLE255})`],
  [`rgb(${ORANGE})`],
  [`rgb(${RED255})`],
  [`rgb(${PURPLE})`],
  [`rgb(${CYAN255})`],
  [`rgb(${GREEN})`],
  [`rgb(${ORANGE255})`],
  [`rgb(${VIOLET})`],
  [`rgb(${YELLOW255})`],
  [`rgb(${GREEN255})`],
  [`rgba(${CYAN})`],
  [`rgb(${BLUE})`],
  [`rgb(${RED})`],
  [`rgb(${DARKCYAN})`],
  [`rgb(${DARKPINK})`],
  [`rgb(${BROWN})`],
  [`rgb(${DARKGREEN})`],
  [`rgb(${NAVYBLUE})`],
  [`rgba(${PINK})`],
  [`rgb(${DARKRED})`],
  [`rgb(${DARKYELLOW})`],
  [`rgb(${PINK255})`],
  [`rgb(${BLUE255})`],
  [`rgba(${YELLOW})`],
  [`rgb(${PURPLE255})`],
  [`rgb(${ORANGE})`],
  [`rgb(${RED255})`],
  [`rgb(${PURPLE})`],
  [`rgb(${CYAN255})`],
  [`rgb(${GREEN})`],
  [`rgb(${ORANGE255})`],
  [`rgb(${VIOLET})`],
  [`rgb(${YELLOW255})`],
  [`rgb(${GREEN255})`],
  [`rgba(${CYAN})`],
  [`rgb(${BLUE})`],
  [`rgb(${RED})`],
  [`rgb(${DARKCYAN})`],
  [`rgb(${DARKPINK})`],
  [`rgb(${BROWN})`],
];
