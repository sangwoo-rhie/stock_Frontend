// const stockPort = '52.79.115.32:3000';
const stockPort = 'localhost:3000';

// 로그인 여부 확인
const stockToken = localStorage.getItem('cookie');
const expiration = localStorage.getItem('tokenExpiration');
const isTokenExpired = new Date().getTime() > expiration;

if (!stockToken || isTokenExpired) {
  localStorage.setItem('cookie', '');
  localStorage.setItem('tokenExpiration', '');
  const inoutBtn = $('#logout-button');
  $('.profile-button').css('display', 'none');
  $(inoutBtn).text('Login');
  setTimeout(() => {
    alert('로그인이 필요한 기능입니다.');
  }, 500);
} else {
  const inoutBtn = $('#logout-button');
  $(inoutBtn).html('<i class="fas fa-sign-out-alt"></i> Logout');
}

const urlParams = new URLSearchParams(window.location.search);
const imageId = urlParams.get('file_id');
console.log('imageId', imageId);
if (imageId) {
  fetchImage(imageId, stockToken);
}

// 주식 이미지
async function fetchImage(imageId, stockToken) {
  console.log('ImageId2', imageId);
  try {
    const response = await axios.get(`http://${stockPort}/image/${imageId}`, {
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${stockToken}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('response ', response);
    const imageData = response.data;
    console.log('imageData', imageData);

    const blob = new Blob([imageData], { type: 'image/jpeg' });
    const imageURL = URL.createObjectURL(blob);
    const stockImage = document.getElementById('stockImage');
    stockImage.src = imageURL;
  } catch (error) {
    console.error('error', error);
  }
}

// <!-- 목록 조회 -->
$(document).ready(function () {
  totalStockPage(1, 10);
});

async function totalStockPage(page, limit) {
  let nowPage = 1;

  const Table = $('#total-table');
  const PagenationTag = $('#total-pagenation');
  const totalPrevButton = `<li id="prev-button" class="page-item"><a class="page-link">이전</a></li>`;
  const totalNextButton = `<li id="next-button" class="page-item"><a class="page-link">다음</a></li>`;

  let pageNumbers = '';
  let pageNumbersHtml = '';

  const data = await getData(page, limit);
  console.log('data', data);
  const stocks = data.data.stockfile.paginationTotalStocks;
  console.log('stocks', stocks);

  let num = 1;
  let totalTemp = '';

  for (const stock of stocks) {
    const stockData = stock.data.split('\n')[1].split(',');
    const temp = `<tr>
      <td scope="row">${num}</td>
      <td>${stockData[0]}</td>
      <td>${stockData[1]}</td>
      <td>${stockData[2]}</td>
      <td>${stockData[3]}</td>
      <td>${stockData[4]}</td>
      <td>${stockData[5]}</td>
      <td>${stockData[6]}</td>
    </tr>`;
    totalTemp += temp;
    num++;
  }
  Table.html(totalTemp);

  const totalPages = data.data.stockfile.totalPages;

  for (let i = 1; i < totalPages; i++) {
    pageNumbers += `<li class="page-item page-number-total">
                      <a id="nowPage-${i}-total" class="page-link">${i}</a>
                    </li>`;
  }

  pageNumbersHtml = totalPrevButton + pageNumbers + totalNextButton;
  PagenationTag.html(
    `<ul class="pagination justify-content-center">${pageNumbersHtml}</ul>`,
  );

  const prevBtn = $('#prev-button');
  const nextBtn = $('#next-button');
  const pages = $('.page-number-total');

  $(pages)
    .find(`#nowPage-${nowPage}-total`)
    .css('background-color', 'rgb(103,119,239)');
  $(pages).find(`#nowPage-${nowPage}-total`).css('color', 'white');

  // Previous Button Clicked
  $(prevBtn).click(async () => {
    if (nowPage > 1) {
      $(pages).find('.page-link').css('background-color', '');
      $(pages).find('.page-link').css('color', '');

      try {
        const { data } = await getData(nowPage - 1, 10);
        const stocks = data.stockfile.paginationTotalStocks;

        let num = (nowPage - 1) * 10 - 9;
        let totalTemp = '';

        for (const stock of stocks) {
          const stockData = stock.data.split('\n')[1].split(',');
          const temp = `<tr>
            <td scope="row">${num}</td>
            <td>${stockData[0]}</td>
            <td>${stockData[1]}</td>
            <td>${stockData[2]}</td>
            <td>${stockData[3]}</td>
            <td>${stockData[4]}</td>
            <td>${stockData[5]}</td>
            <td>${stockData[6]}</td>
          </tr>`;
          totalTemp += temp;
          num++;
        }
        Table.html(totalTemp);

        nowPage -= 1;

        $(pages)
          .find(`#nowPage-${nowPage}-total`)
          .css('background-color', 'rgb(103,119,239)');
        $(pages).find(`#nowPage-${nowPage}-total`).css('color', 'white');
      } catch (error) {
        console.log('Error Message', error.response.data.message);
      }
    }
  });

  // Next Button Clicked
  $(nextBtn).click(async () => {
    if (nowPage > 0 && nowPage < totalPages) {
      $(pages).find('.page-link').css('background-color', '');
      $(pages).find('.page-link').css('color', '');

      try {
        const { data } = await getData(nowPage + 1, 10);
        const stocks = data.stockfile.paginationTotalStocks;

        let num = (nowPage + 1) * 10 - 9;
        let totalTemp = '';

        for (const stock of stocks) {
          const stockData = stock.data.split('\n')[1].split(',');
          const temp = `<tr>
            <td scope="row">${num}</td>
            <td>${stockData[0]}</td>
            <td>${stockData[1]}</td>
            <td>${stockData[2]}</td>
            <td>${stockData[3]}</td>
            <td>${stockData[4]}</td>
            <td>${stockData[5]}</td>
            <td>${stockData[6]}</td>
          </tr>`;
          totalTemp += temp;
          num++;
        }
        Table.html(totalTemp);

        nowPage += 1;

        $(pages)
          .find(`#nowPage-${nowPage}-total`)
          .css('background-color', 'rgb(103,119,239)');
        $(pages).find(`#nowPage-${nowPage}-total`).css('color', 'white');
      } catch (error) {
        console.log('Error Message', error.response.data.message);
      }
    }
  });

  // Each Page Clicked
  $(pages).each((index, page) => {
    $(page).click(async () => {
      $(pages).find('.page-link').css('background-color', '');
      $(pages).find('.page-link').css('color', '');

      try {
        const pageNumber = parseInt($(page).find('.page-link').text());

        const { data } = await getData(pageNumber, limit);
        const images = data.stockfile.paginationTotalStocks;

        let num = pageNumber * 10 - 9;
        let totalTemp = '';

        for (const stock of stocks) {
          const stockData = stock.data.split('\n')[1].split(',');
          const temp = `<tr>
            <td scope="row">${num}</td>
            <td>${stockData[0]}</td>
            <td>${stockData[1]}</td>
            <td>${stockData[2]}</td>
            <td>${stockData[3]}</td>
            <td>${stockData[4]}</td>
            <td>${stockData[5]}</td>
            <td>${stockData[6]}</td>
          </tr>`;
          totalTemp += temp;
          num++;
        }
        Table.html(totalTemp);

        nowPage = pageNumber;
        // console.log(nowPage);

        $(pages)
          .find(`#nowPage-${nowPage}-total`)
          .css('background-color', 'rgb(103,119,239)');
        $(pages).find(`#nowPage-${nowPage}-total`).css('color', 'white');
      } catch (error) {
        console.error('Error message:', error.response.data.message);
      }
    });
  });
}

async function getData(page, limit) {
  const data = await axios.get(
    `http://${stockPort}/image/${imageId}?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: ` ${stockToken}`,
      },
    },
  );
  console.log('getData', data);
  return data.data;
}
