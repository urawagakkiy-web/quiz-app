// ===== 問題データ =====
// 問題数はどこにもハードコードしない。表示・判定はすべて QUIZ.length と正答率から算出する。
const QUIZ = [
  {
    q: 'ことわざ「五十歩百歩」と、もっとも意味が近い四字熟語はどれ？',
    choices: ['大同小異', '一石二鳥', '臨機応変', '温故知新'],
    answer: 0,
    note: 'どちらも「細かい違いはあっても、本質的には同じ」という意味です。出典は『孟子』で、戦場で50歩逃げた者が100歩逃げた者を笑うのはおかしい、という問答からきています。'
  },
  {
    q: '日本でいちばん面積が大きい湖はどれ？',
    choices: ['霞ヶ浦', 'サロマ湖', '琵琶湖', '猪苗代湖'],
    answer: 2,
    note: '滋賀県にある琵琶湖で、面積は約670平方キロメートル。滋賀県の面積のおよそ6分の1を占めます。2位は茨城県の霞ヶ浦です。'
  },
  {
    q: '太陽系の惑星のうち、太陽にいちばん近いのはどれ？',
    choices: ['金星', '水星', '火星', '地球'],
    answer: 1,
    note: '太陽に近い順に「水・金・地・火・木・土・天・海」と並び、先頭が水星です。金星は2番目ですが、分厚い二酸化炭素の大気に覆われているため表面温度は水星より高くなります。'
  },
  {
    q: '日本国憲法の「三大原則」に含まれないのはどれ？',
    choices: ['国民主権', '基本的人権の尊重', '平和主義', '三権分立'],
    answer: 3,
    note: '三大原則は「国民主権」「基本的人権の尊重」「平和主義」の3つです。三権分立は権力を立法・行政・司法に分ける統治の仕組みで、憲法に定められてはいますが三大原則そのものではありません。'
  },
  {
    q: '為替相場が「1ドル＝100円」から「1ドル＝120円」に動いた状態を何という？',
    choices: ['円高', 'デフレ', '円安', 'インフレ'],
    answer: 2,
    note: '同じ1ドルを手に入れるのに、より多くの円が必要になった＝円の価値が下がった状態なので「円安」です。輸出企業には追い風、輸入品の値段には逆風になります。'
  },
  {
    q: '北半球で、1年のうち昼の時間がもっとも長くなる日を何という？',
    choices: ['立夏', '夏至', '大暑', '春分'],
    answer: 1,
    note: '6月21日ごろの「夏至」です。逆に夜がもっとも長くなるのが12月21日ごろの「冬至」で、春分・秋分は昼と夜がほぼ同じ長さになります。'
  },
  {
    q: '「世界遺産」の登録を行っている国際機関はどれ？',
    choices: ['WHO（世界保健機関）', 'IMF（国際通貨基金）', 'UNICEF（国連児童基金）', 'UNESCO（国連教育科学文化機関）'],
    answer: 3,
    note: 'UNESCO（ユネスコ）です。1972年に採択された世界遺産条約にもとづき、文化遺産・自然遺産・複合遺産の3種類が登録されます。'
  },
  {
    q: '標高の高い山の上で湯をわかすと、水の沸点はどうなる？',
    choices: ['低くなる', '高くなる', '変わらない', '水が凍って沸かせない'],
    answer: 0,
    note: '標高が高いほど気圧が低くなり、沸点も下がります。富士山の山頂ではおよそ88℃で沸騰するため、ごはんが芯の残った炊き上がりになりやすくなります。'
  },
  {
    q: '日本で法律をつくる権限（立法権）を持っているのはどれ？',
    choices: ['内閣', '裁判所', '国会', '会計検査院'],
    answer: 2,
    note: '憲法41条で、国会は「国権の最高機関であって、国の唯一の立法機関」と定められています。内閣は行政、裁判所は司法を担当します。'
  },
  {
    q: 'ことわざ「情けは人のためならず」の本来の意味はどれ？',
    choices: ['人に親切にすれば、巡り巡って自分に返ってくる', '情けをかけるとその人の成長のためにならない', '情けをかけても相手には伝わらない', '人の情けをあてにしてはいけない'],
    answer: 0,
    note: '「人のためならず」は「その人のためではなく（自分のためになる）」という意味です。「甘やかすのは本人のためにならない」という解釈は本来の意味とは異なり、よくある誤用として知られています。'
  }
];

// ===== 進行状態 =====
let index = 0;      // 何問目を表示しているか（0始まり）
let score = 0;      // 正解数
let results = [];   // 各問の正誤（true / false）

const main = document.getElementById('main');
const sub = document.getElementById('sub');
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progressBar');

// ===== スタート画面 =====
function renderStart() {
  index = 0;
  score = 0;
  results = [];

  sub.textContent = '全' + QUIZ.length + '問・4択';
  progress.hidden = true;
  setProgress(0);

  main.innerHTML = `
    <p class="lead">
      ことわざ・地理・理科・社会・経済から全${QUIZ.length}問を出題します。<br>
      1問ずつ答え合わせをしながら進み、最後に合計スコアが出ます。
    </p>
    <button class="btn" id="startBtn">スタート</button>
  `;

  document.getElementById('startBtn').addEventListener('click', renderQuestion);
}

// ===== 問題画面 =====
function renderQuestion() {
  const item = QUIZ[index];

  sub.textContent = '第' + (index + 1) + '問 / 全' + QUIZ.length + '問';
  progress.hidden = false;
  setProgress(index / QUIZ.length);

  const choices = item.choices.map((text, i) => `
    <button class="choice" data-i="${i}">
      <span class="mark">${'ABCD'[i]}</span>
      <span>${text}</span>
    </button>
  `).join('');

  main.innerHTML = `
    <p class="question">Q${index + 1}. ${item.q}</p>
    <div class="choices">${choices}</div>
  `;

  main.querySelectorAll('.choice').forEach((btn) => {
    btn.addEventListener('click', () => select(Number(btn.dataset.i)));
  });
}

// ===== 回答とフィードバック =====
function select(selected) {
  const item = QUIZ[index];
  const isCorrect = selected === item.answer;

  if (isCorrect) score++;
  results.push(isCorrect);

  // 選択肢を固定し、正解に○・選んだ誤答に×を付ける（色だけに頼らない）
  main.querySelectorAll('.choice').forEach((btn) => {
    const i = Number(btn.dataset.i);
    btn.disabled = true;
    if (i === item.answer) {
      btn.classList.add('is-correct');
      btn.querySelector('.mark').textContent = '○';
    } else if (i === selected) {
      btn.classList.add('is-wrong');
      btn.querySelector('.mark').textContent = '×';
    }
  });

  setProgress((index + 1) / QUIZ.length);

  const isLast = index === QUIZ.length - 1;
  const feedback = document.createElement('div');
  feedback.className = 'feedback ' + (isCorrect ? 'correct' : 'wrong');
  feedback.innerHTML = `
    <p class="feedback-title">${isCorrect ? '○ 正解！' : '× 不正解'}</p>
    <p class="feedback-note">
      ${isCorrect ? '' : '正解は「' + item.choices[item.answer] + '」です。<br>'}${item.note}
    </p>
  `;
  main.appendChild(feedback);

  const next = document.createElement('button');
  next.className = 'btn';
  next.id = 'nextBtn';
  next.textContent = isLast ? '結果を見る' : '次の問題へ';
  main.appendChild(next);

  next.addEventListener('click', () => {
    if (isLast) {
      finish();
    } else {
      index++;
      renderQuestion();
    }
  });
}

// ===== 結果画面 =====
function finish() {
  const rate = score / QUIZ.length;

  sub.textContent = '結果';
  setProgress(1);

  const review = QUIZ.map((item, i) => `
    <li>
      <span class="mark ${results[i] ? 'ok' : 'ng'}">${results[i] ? '○' : '×'}</span>
      <span>Q${i + 1} ${item.q}<br>正解：${item.choices[item.answer]}</span>
    </li>
  `).join('');

  main.innerHTML = `
    <div class="result">
      <p class="score">${QUIZ.length}問中 <strong>${score}</strong> 問正解</p>
      <p class="grade">正答率 ${Math.round(rate * 100)}%　${grade(rate)}</p>
      <ul class="review">${review}</ul>
      <button class="btn" id="retryBtn">もう一度挑戦する</button>
    </div>
  `;

  document.getElementById('retryBtn').addEventListener('click', renderStart);
}

// 成績判定は得点の固定値ではなく正答率で決める
function grade(rate) {
  if (rate === 1) return '全問正解！文句なしの常識力です。';
  if (rate >= 0.8) return 'かなりの高得点。あと少しで満点です。';
  if (rate >= 0.6) return '合格ライン。取りこぼした問題を解説で確認しましょう。';
  if (rate >= 0.4) return 'もう一歩。解説を読んでから再挑戦してみましょう。';
  return '伸びしろたっぷり。解説を読めば次はきっと上がります。';
}

function setProgress(ratio) {
  progressBar.style.width = Math.round(ratio * 100) + '%';
}

renderStart();
