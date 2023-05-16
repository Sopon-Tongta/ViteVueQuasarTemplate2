import { useQuasar, QSpinnerCube } from "quasar";

const useUtil = () => {
  const $q = useQuasar();

  const uid = () => {
    let a = new Uint32Array(3);
    window.crypto.getRandomValues(a);
    return (
      performance.now().toString(36) +
      Array.from(a)
        .map((A) => A.toString(36))
        .join("")
    ).replace(/\./g, "");
  };

  const formatDate_DDMMYYYY = (date) => {
    var d = new Date(date);
    var month = "" + (d.getMonth() + 1);
    var day = "" + d.getDate();
    var year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  };

  const formatDate_DB = (date_str) => {
    var split_date = date_str.replaceAll("-", "/").split("/");
    if (split_date.length != 3) {
      return "";
    }
    return [split_date[2], split_date[1], split_date[0]].join("-");
  };

  const alertFetchError = (message) => {
    $q.loading.show({
      spinner: QSpinnerCube,
      spinnerSize: 50,
      spinnerColor: "theme-color",
      messageColor: "black",
      backgroundColor: "white",
      message: "Please wait..",
    });

    $q.notify({
      type: "negative",
      message: message,
      position: "top",
      timeout: 1000 * 60 * 60 * 24,
      actions: [
        {
          icon: "close",
          color: "white",
          round: true,
          size: "sm",
          "aria-label": "Dismiss",
        },
      ],
    });
  };

  const addComma = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getRangeYearsFromCurrent = (positive, negative) => {
    let yearNow = new Date().getFullYear();
    let yearStart = yearNow - negative;
    let yearEnd = yearNow + positive;
    let listYears = [];
    for (let i = yearStart; i <= yearEnd; i++) {
      listYears.push(i);
    }
    return listYears;
  };

  const getAllMonths = () => {
    return [
      { month: 1, name: "มกราคม" },
      { month: 2, name: "กุมภาพันธ์" },
      { month: 3, name: "มีนาคม" },
      { month: 4, name: "เมษายน" },
      { month: 5, name: "พฤษภาคม" },
      { month: 6, name: "มิถุนายน" },
      { month: 7, name: "กรกฎาคม" },
      { month: 8, name: "สิงหาคม" },
      { month: 9, name: "กันยายน" },
      { month: 10, name: "ตุลาคม" },
      { month: 11, name: "พฤศจิกายน" },
      { month: 12, name: "ธันวาคม" },
    ];
  };

  return {
    uid,
    formatDate_DDMMYYYY,
    formatDate_DB,
    alertFetchError,
    addComma,
    getRangeYearsFromCurrent,
    getAllMonths,
  };
};

export default { useUtil };
