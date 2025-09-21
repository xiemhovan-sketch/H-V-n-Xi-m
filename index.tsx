
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// --- BỘ CÂU HỎI ---
const questions = [
  {
    question: "Ngân hàng thương mại có chức năng chính nào sau đây?",
    answers: [
      "Cấp phát ngân sách Nhà nước",
      "Nhận tiền gửi và cho vay",
      "Ban hành chính sách tiền tệ",
      "Quản lý thuế"
    ],
    correct: 1
  },
  {
    question: "CASA trong ngân hàng là viết tắt của gì?",
    answers: [
      "Current Account Savings Account",
      "Credit And Savings Association",
      "Cash And Stock Agreement",
      "Customer And Service Access"
    ],
    correct: 0
  },
  {
    question: "Tổ chức nào đóng vai trò là Ngân hàng Trung ương tại Việt Nam?",
    answers: [
      "Ngân hàng Nhà nước Việt Nam",
      "Ngân hàng Nông nghiệp và PTNT",
      "VietinBank",
      "Ngân hàng Chính sách Xã hội"
    ],
    correct: 0
  },
  {
    question: "NIM (Net Interest Margin) phản ánh điều gì?",
    answers: [
      "Chênh lệch giữa thu nhập lãi và chi phí lãi",
      "Tổng thu nhập từ phí dịch vụ",
      "Chi phí hoạt động của ngân hàng",
      "Doanh thu từ ngoại hối"
    ],
    correct: 0
  },
  {
    question: "Sản phẩm nào dưới đây KHÔNG phải là dịch vụ ngân hàng?",
    answers: [
      "Cho vay tiêu dùng",
      "Mở tài khoản thanh toán",
      "Cung cấp thẻ tín dụng",
      "Bán hàng tạp hóa"
    ],
    correct: 3
  },
  {
    question: "SWIFT Code thường dùng cho mục đích nào?",
    answers: [
      "Chuyển tiền quốc tế",
      "Thanh toán trong nước",
      "Xác thực người dùng Internet Banking",
      "Tính toán lãi suất"
    ],
    correct: 0
  },
  {
    question: "Tỷ lệ an toàn vốn (CAR) được quy định bởi chuẩn mực nào?",
    answers: [
      "Basel I, II, III",
      "IFRS",
      "GAAP",
      "AML"
    ],
    correct: 0
  },
  {
    question: "Thẻ ATM có thể thực hiện chức năng nào sau đây?",
    answers: [
      "Rút tiền mặt",
      "Chuyển khoản",
      "Thanh toán hóa đơn",
      "Tất cả các đáp án trên"
    ],
    correct: 3
  },
  {
    question: "Trong báo cáo tài chính ngân hàng, 'Dư nợ' phản ánh gì?",
    answers: [
      "Số tiền khách hàng gửi",
      "Số tiền ngân hàng đã cho vay nhưng chưa thu hồi",
      "Lợi nhuận trước thuế",
      "Chi phí hoạt động"
    ],
    correct: 1
  },
  {
    question: "Một trong các mục tiêu chính của ngân hàng số là gì?",
    answers: [
      "Tăng chi nhánh vật lý",
      "Giảm chi phí vận hành và nâng cao trải nghiệm khách hàng",
      "Hạn chế giao dịch điện tử",
      "Loại bỏ các sản phẩm truyền thống"
    ],
    correct: 1
  }
];

// --- LẤY CÁC PHẦN TỬ HTML ---
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const quizContainer = document.getElementById('quiz-container');
const resultsContainer = document.getElementById('results-container');
const resultsText = document.getElementById('results-text');
const restartBtn = document.getElementById('restart-btn');
const progressText = document.getElementById('progress-text');
const progressBarFull = document.getElementById('progress-bar-full');
const questionNavElement = document.getElementById('question-nav');
const showResultsBtn = document.getElementById('show-results-btn');

// --- BIẾN TRẠNG THÁI CỦA QUIZ ---
let currentQuestionIndex = 0;
let score = 0;
let shuffledQuestions = [];
const answeredQuestions = new Set<number>();

// --- HÀM XÁO TRỘN MẢNG ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- HÀM TẠO THANH ĐIỀU HƯỚNG ---
function createNavigation() {
    questionNavElement.innerHTML = '';
    shuffledQuestions.forEach((_, index) => {
        const navButton = document.createElement('button');
        navButton.innerText = (index + 1).toString();
        navButton.classList.add('nav-btn');
        navButton.dataset.index = index.toString();
        navButton.addEventListener('click', () => showQuestion(index));
        questionNavElement.appendChild(navButton);
    });
}

// --- HÀM KHỞI ĐỘNG QUIZ ---
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    answeredQuestions.clear();
    shuffledQuestions = [...questions];
    shuffleArray(shuffledQuestions);
    
    quizContainer.style.display = 'block';
    resultsContainer.style.display = 'none';
    showResultsBtn.style.display = 'block';
    
    createNavigation();
    showQuestion(0);
}

// --- HÀM HIỂN THỊ CÂU HỎI ---
function showQuestion(index: number) {
    currentQuestionIndex = index;
    resetState();
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

    // Cập nhật progress bar theo số câu đã trả lời
    progressText.innerText = `Đã trả lời ${answeredQuestions.size} / ${shuffledQuestions.length}`;
    progressBarFull.style.width = `${(answeredQuestions.size / shuffledQuestions.length) * 100}%`;

    // Cập nhật trạng thái nút điều hướng
    Array.from(questionNavElement.children).forEach(buttonEl => {
        const button = buttonEl as HTMLButtonElement;
        button.classList.remove('current');
        if (parseInt(button.dataset.index) === currentQuestionIndex) {
            button.classList.add('current');
        }
    });

    // Tạo các nút trả lời
    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.innerText = answer;
        button.classList.add('btn');
        button.dataset.correct = (index === currentQuestion.correct).toString();
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

// --- HÀM XỬ LÝ KHI CHỌN CÂU TRẢ LỜI ---
function selectAnswer(e) {
    const selectedBtn = e.target as HTMLButtonElement;
    const isCorrect = selectedBtn.dataset.correct === 'true';

    if (isCorrect) {
        // Chỉ tăng điểm nếu câu này chưa được trả lời đúng trước đó
        if (!answeredQuestions.has(currentQuestionIndex)) {
             score++;
        }
    }

    selectedBtn.classList.add(isCorrect ? 'correct' : 'incorrect');

    // Hiển thị đáp án đúng và vô hiệu hóa các nút
    Array.from(answerButtonsElement.children).forEach(buttonEl => {
        const button = buttonEl as HTMLButtonElement;
        if (button.dataset.correct === 'true') {
            button.classList.add('correct');
        }
        button.disabled = true;
    });

    const wasAlreadyAnswered = answeredQuestions.has(currentQuestionIndex);
    answeredQuestions.add(currentQuestionIndex);

    // Cập nhật nút điều hướng thành màu xanh
    const navButton = questionNavElement.querySelector(`[data-index='${currentQuestionIndex}']`) as HTMLButtonElement;
    if (navButton) {
        navButton.classList.add('answered');
    }

    // Cập nhật thanh tiến độ nếu đây là câu trả lời mới
    if (!wasAlreadyAnswered) {
        progressText.innerText = `Đã trả lời ${answeredQuestions.size} / ${shuffledQuestions.length}`;
        progressBarFull.style.width = `${(answeredQuestions.size / shuffledQuestions.length) * 100}%`;
    }

    // Kiểm tra xem đã hoàn thành quiz chưa
    if (answeredQuestions.size === shuffledQuestions.length) {
        setTimeout(showResults, 1200);
    }
}

// --- HÀM HIỂN THỊ KẾT QUẢ ---
function showResults() {
    quizContainer.style.display = 'none';
    resultsContainer.style.display = 'flex';
    showResultsBtn.style.display = 'none';
    resultsText.innerText = `Bạn đã trả lời đúng ${score} trên ${shuffledQuestions.length} câu!`;
}

// --- HÀM ĐẶT LẠI TRẠNG THÁI CÂU HỎI ---
function resetState() {
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

// --- THÊM SỰ KIỆN CHO CÁC NÚT ---
restartBtn.addEventListener('click', startQuiz);
showResultsBtn.addEventListener('click', showResults);

// --- BẮT ĐẦU QUIZ KHI TẢI TRANG ---
startQuiz();