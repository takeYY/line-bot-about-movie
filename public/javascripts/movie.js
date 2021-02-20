$(document).ready(function () {
  const LIFF_MOVIE_ID = $('#liff-movie-id').data('liff');
  initializeLiff(LIFF_MOVIE_ID)
  $('#form').submit(function (event) {
    let values = {};
    values.type = 'movie';
    $.each($('#form').serializeArray(), function (i, field) {
      values[field.name] = field.value;
    });
    let genres = [];
    $('input:checkbox[name="genres"]:checked').each(function () {
      genres.push($(this).val());
    });
    values.genres = genres;
    values.overview = $('#btn-group-overview > .btn.active').text().trim();
    liff.sendMessages([{
      type: 'text',
      text: JSON.stringify(values)
    }]).then(function () {
      liff.closeWindow()
    }).catch(function (error) {
      window.alert('Failed to send message ' + error);
    });
    event.preventDefault();
  });
})
function initializeLiff(liffId) {
  liff
    .init({
      liffId: liffId
    })
    .then(() => {
      console.log('LIFF Initialization succeed')
    })
    .catch((err) => {
      console.log('LIFF Initialization failed ', err)
    });
}
