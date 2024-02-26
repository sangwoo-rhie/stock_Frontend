// const signupPort = '52.79.115.32:3000';
const signupPort = 'localhost:3000';

// 회원가입
const signUp = async () => {
  try {
    const email = $('#email').val();
    const password = $('#password').val();
    const confirmPassword = $('#confirm_password').val();
    const nickname = $('#nickname').val();
    const organization = $('#organization').val();

    // 라디오 버튼 값 가져오기
    const role = $("input[name='category']:checked").val();

    if (!email) {
      alert('이메일(E-mail)을 입력해주세요.');
      return;
    }
    if (!password) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    if (!confirmPassword) {
      alert('비밀번호 확인을 입력해주세요.');
      return;
    }
    if (!nickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    if (!organization) {
      alert('소속을 입력해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    console.log('email', email);
    console.log('password', password);
    console.log('nickname', nickname);
    console.log('organization', organization);
    console.log('role', role);

    await axios.post(`http://${signupPort}/user/signup`, {
      email,
      password,
      confirmPassword,
      nickname,
      organization,
      role,
    });

    alert('회원가입이 완료되었습니다.');
    location.href = `login.html`;
  } catch (error) {
    alert(error.response.data.message);
    console.error(error);
  }
};
$('#signUp_btn').click(signUp);
