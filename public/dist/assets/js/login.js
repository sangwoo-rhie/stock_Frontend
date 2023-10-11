// const loginPort = '3.39.9.221:3000';
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
    .post(`http://${loginPort}/auth/login`, {
      email: $('#email').val(),
      password: $('#password').val(),
    })
    .then((response) => {
      localStorage.setItem(
        `cookie`,
        `Bearer ${response.data.data.accessToken}`,
      );
      const expirationDate = new Date().getTime() + 21600 * 1000;
      localStorage.setItem('tokenExpiration', expirationDate);
      if (response.data.data.status === 'admin') {
        location.href = 'admin.html';
      } else {
        alert('반갑습니다 회원님!');
        location.href = `main.html?id=${response.data.data.userId}`;
      }
    })
    .catch((error) => {
      alert(error.response.data.message);
    });

  // 카카오로그인
  await axios
    .post(`http://${loginPort}/auth/kakao/login`, {
      email: $('#email').val(),
      password: $('#password').val(),
    })
    .then((response) => {
      localStorage.setItem(
        `cookie`,
        `Bearer ${response.data.data.accessToken}`,
      );
      const expirationDate = new Date().getTime() + 21600 * 1000;
      localStorage.setItem('tokenExpiration', expirationDate);
      alert('반갑습니다 회원님!');
      location.href = `main.html?id=${response.data.data.userId}`;
    })
    .catch((error) => {
      alert(error.response.data.message);
    });

  // 구글로그인
  await axios
    .post(`http://${loginPort}/auth/google/login`, {
      email: $('#email').val(),
      password: $('#password').val(),
    })
    .then((response) => {
      localStorage.setItem(
        `cookie`,
        `Bearer ${response.data.data.accessToken}`,
      );
      const expirationDate = new Date().getTime() + 21600 * 1000;
      localStorage.setItem('tokenExpiration', expirationDate);
      alert('반갑습니다 회원님!');
      location.href = `main.html?id=${response.data.data.userId}`;
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
};

$('#login-btn').click(login);
