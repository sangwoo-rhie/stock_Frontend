// const loginPort = '52.79.115.32:3000;
const loginPort = 'localhost:3000';

$(document).ready(function () {
  $('.btn-show-pass').on('click', function (event) {
    event.preventDefault();
    if ($('#password').attr('type') == 'text') {
      $('#password').attr('type', 'password');
      $('.fa').addClass('fa-eye');
      $('.fa').removeClass('fa-eye-slash');
    } else if ($('#password').attr('type') == 'password') {
      $('#password').attr('type', 'text');
      $('.fa').removeClass('fa-eye');
      $('.fa').addClass('fa-eye-slash');
    }
  });
});

const login = async () => {
  if (!$('#email').val()) {
    alert('계정(e-mail)을 입력해주세요');
    return;
  }
  if (!$('#password').val()) {
    alert('비밀번호를 입력해주세요');
    return;
  }

  await axios
    .post(`http://${loginPort}/user/signin`, {
      email: $('#email').val(),
      password: $('#password').val(),
    })
    .then((response) => {
      localStorage.setItem(`cookie`, `Bearer ${response.data.data.token}`);
      const expirationDate = new Date().getTime() + 21600 * 1000;
      localStorage.setItem('tokenExpiration', expirationDate);
      alert('반갑습니다 회원님!');
      // 아래 주소는 로그인 이후 메인페이지로 이동하도록 주소를 수정해야됨
      location.href = `stock_list.html`;
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
};

$('#login-btn').click(login);
