const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const pool = require("./db");
const { addListener } = require("./db");

const convert = require("html-to-json-data");
const {
  group,
  text,
  number,
  href,
  src,
  uniq,
} = require("html-to-json-data/definitions");

const PORT = 3030;

app.use(cors());
app.use(express.json());

const groupArr = (arr, size) => {
  let testArr = [];
  const createGroup = (arr, size) => {
    // base case
    if (arr.length <= size) {
      testArr.push(arr);
    } else {
      let group = arr.slice(0, size);
      let remainder = arr.slice(size);
      testArr.push(group);
      createGroup(remainder, size);
    }
  };
  createGroup(arr, size);
  return testArr;
};

app.get("/", (req, res) => {
  res.send("This is a sample express app");
});

app.get("/data", async (req, res) => {
  let offset = req.query.page * 60;
  try {
    const allData = await pool.query(
      `SELECT "G33", "G15", "G34", "G1B", "ZA_ED", "ZA_KG", "G31NAME" FROM reppaym2 offset ${offset} limit 60`
    );
    const output = allData.rows.map(function (obj) {
      return Object.keys(obj).map(function (key) {
        return obj[key];
      });
    });

    res.send(output);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/find", async (req, res) => {
  let offset = req.query.page * 30;
  let text = req.query.text;
  let col = req.query.col;
  let terms = req.query.terms;

  try {
    const allData = await pool.query(
      `select "G8NAME", "G33", "G45", "G13", "G23", "G15" from reppaym2 where "${col}" = '${text}' offset ${offset} limit 30`
    );
    const output = allData.rows.map(function (obj) {
      return Object.keys(obj).map(function (key) {
        return obj[key];
      });
    });

    res.send(output);
  } catch (err) {
    console.log(err.message);
  }
});

app.post("/calc", async (req, res) => {
  let {productCost, productTrans, productQtyEd, productQty, byBulletin, transPrice, setTime, overTime, totalPre, tnved, mode, sending_country, orign_country, trade_country} = req.body

  console.log("req:", req.body)

  //let data = 'total_cost=111&trans_rasxod=222&kolvo_ed=333&kolvo=444&obyom=&stoim_byul=555&stoim_sdelki=333.00&urochni=1&neurochni=2&tam_stoim=3451371.84&tnved=&sending_country=000++&lang=ru_Ru&orign_country=000&trade_country=000&rejim=01';


  let data =`total_cost=${productCost}rans_rasxod=${productTrans}&kolvo_ed=${productQtyEd}&kolvo=${productQty}&obyom=&stoim_byul=${byBulletin}&stoim_sdelki=${transPrice}&urochni=${setTime}&neurochni=${overTime}&tam_stoim=${totalPre}&tnved=${tnved}&sending_country=${sending_country}++&lang=ru_Ru&orign_country=${orign_country}&trade_country=${trade_country}&rejim=${mode}`

  let config = {
    method: "post",
    url: "http://tarif.customs.uz/calc/calc_result.jsp",
    headers: {
      Connection: "keep-alive",
      Accept: "text/html, */*; q=0.01",
      "X-Requested-With": "XMLHttpRequest",
      "Save-Data": "on",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 YaBrowser/20.9.2.102 Yowser/2.5 Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Origin: "http://tarif.customs.uz",
      Referer: "http://tarif.customs.uz/index.jsp?lang=ru_Ru",
      "Accept-Language": "uz,ru;q=0.9,en-US;q=0.8,en;q=0.7",
      Cookie:
        "JSESSIONID=F794F06F48E38D56FE9E6E57A15DB175; JSESSIONID=D9FF2A15210F5D2F74D832FB804F4567",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      const json = convert(response.data, {
        table: group("table", text("td")),
      });

      let docs = groupArr(json.table[0], 3)
      docs.forEach((arr) => arr.shift())

      res.send(docs);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get("/rates", async (req, res) => {
  try {
    let body = `tnved=${req.query.tnved}&rejim=${req.query.mode}&sending_country=${req.query.sending_country}++&lang=ru_Ru&orign_country=${req.query.orign_country}&trade_country=${req.query.trade_country}`;

    const config = {
      method: "post",
      url: "http://tarif.customs.uz/calc/view_calc.jsp",
      headers: {
        Connection: "keep-alive",
        Accept: "text/html, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest",
        "Save-Data": "on",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 YaBrowser/20.9.1.112 Yowser/2.5 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Origin: "http://tarif.customs.uz",
        Referer: "http://tarif.customs.uz/index.jsp",
        "Accept-Language": "uz,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        Cookie:
          "JSESSIONID=23EEE1C50B9A5598442CFE8E9A7D5872; JSESSIONID=35B14C051608ADCCD26A35EA8E9BD2EA",
      },
      data: body,
    };

    axios(config)
      .then(function (response) {
        //  const json = convert(response.data, {
        //   table: group('table tr', text('td'))
        // });

        // res.send(json);

        const json = convert(response.data, {
          sbor: text("#sbor"),
          poshlina: text("#poshlina"),
          aksiz: text("#aksiz"),
          nds: text("#nds"),
          table: group("tbody", text("td")).slice(1, -1),
        });
        res.send(json);
        let jtable = json.table[0];

        //   const groupArr = (arr, size) => {
        //     let testArr = [];
        //     const createGroup = (arr, size) => {
        //         // base case
        //         if (arr.length <= size) {
        //             testArr.push(arr);
        //         } else {
        //             let group = arr.slice(0, size);
        //             let remainder = arr.slice(size);
        //             testArr.push(group);
        //             createGroup(remainder, size);
        //         }
        //     }
        //     createGroup(arr, size);
        //     return testArr;
        // }
        //let jet = jtable.splice(6, 0);
        //jtable.splice(0, 2)
        //jtable.length = 9
        // console.log(groupArr(jtable, 3))
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
});
