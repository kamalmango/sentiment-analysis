// const comments = {'youtube': [
//   'I love this product',
//   'I hate this product',
//   'this is amazing',
//   'hi there how are you'
// ]}

const comments = [
  'I love this product',
  'I hate this product',
  'this is amazing',
  'hi there how are you'
]

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
    console.log('wooohoooooooo', results)
  })


