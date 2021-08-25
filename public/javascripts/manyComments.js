const comments = [
  'I love this!!',
  'I hate this',
  'this is amazing',
  'hi there how are you'
]

var commentSection = document.getElementById('comments')
var topComments = document.getElementById('top-comments')
var inputText = document.getElementById('input')

comments.forEach(comment => {
  commentSection.innerHTML += '<p>'+ comment +'</p>'
})

const ctx = document.getElementById('myChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    //labels: ['Red', 'Yellow', 'Green'],
    datasets: [{
      label: 'sentiment',
      data: [0, 0, 0],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 1
    }]
  }
})

const options = {
  method: 'POST',
  body: JSON.stringify(comments),
  headers: new Headers({ 'Content-Type': 'application/json' })
}


fetch('/api/nlp/bulk-analyzer', options)
  .then(res => res.json())
  .then(results => {
    console.log('ressulltsss', results)
    chart.data.datasets.forEach(dataset => {
      dataset.data = [results.negFraction, results.neuFraction, results.posFraction]
    })
    chart.update()
  })


fetch('/api/nlp/top-comments', options)
  .then(res => res.json())
  .then(results => {
    for (var i = 0; i < 2; i++) {
      topComments.innerHTML += '<p>'+ results[i].comment +'</p>'
    }
  })


const submitComment = () => {
  const comment = document.getElementById('input').value
  commentSection.innerHTML += '<p>'+ comment +'</p>'
  comments.push(comment)

  const options2 = {
    method: 'POST',
    body: JSON.stringify(comments),
    headers: new Headers({ 'Content-Type': 'application/json' })
  }

  fetch('/api/nlp/bulk-analyzer', options2)
  .then(res => res.json())
  .then(results => {
    console.log('ressulltsss', results)
    chart.data.datasets.forEach(dataset => {
      dataset.data = [results.negFraction, results.neuFraction, results.posFraction]
    })
    chart.update()
  })

  topComments.innerHTML = ''

  fetch('/api/nlp/top-comments', options2)
  .then(res => res.json())
  .then(results => {
    for (var i = 0; i < 2; i++) {
      topComments.innerHTML += '<p>'+ results[i].comment +'</p>'
    }
  })
  inputText.value = ''

}

document.getElementById('input').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    submitComment()
  }
})


