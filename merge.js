const fs = require('fs');
const xml2js = require('xml2js');

// 读取XML文件
const engXml = fs.readFileSync('data/english.xml', 'utf8');
const chnXml = fs.readFileSync('data/mandarin.xml', 'utf8');

// 创建一个新的xml2js解析器
const parser = new xml2js.Parser({
  cdata : true
});

// 解析XML
parser.parseString(engXml, (err, targetJson) => {
    if (err) {
        throw err;
    }

    parser.parseString(chnXml, (err, srcJson) => {
      if (err) {
          throw err;
      }

      for (let i = 0; i < targetJson.test.questions[0].question.length; i++) {
        let targetQuestion = targetJson.test.questions[0].question[i];
        let srcQuestion = srcJson.test.questions[0].question[i];
        targetQuestion.text = {
          default: targetQuestion.text[0],
          mandarin: srcQuestion.text[0]
        }

        targetQuestion.answers[0].answer = {
          default: targetQuestion.answers[0].answer[0],
          mandarin: srcQuestion.answers[0].answer[0],
        }
        targetQuestion.answers[0].distractor_1 = {
          default: targetQuestion.answers[0].distractor_1[0],
          mandarin: srcQuestion.answers[0].distractor_1[0],
        }
        targetQuestion.answers[0].distractor_2 = {
          default: targetQuestion.answers[0].distractor_2[0],
          mandarin: srcQuestion.answers[0].distractor_2[0],
        }
        targetQuestion.answers[0].distractor_3 = {
          default: targetQuestion.answers[0].distractor_3[0],
          mandarin: srcQuestion.answers[0].distractor_3[0],
        }
      }
      // 将对象序列化回XML
      const builder = new xml2js.Builder({
        cdata : true
      });
      const xmlOutput = builder.buildObject(targetJson);

      // 写回到文件或进行其他处理
      fs.writeFileSync('data/mandarin_merged.xml', xmlOutput);


    });
});