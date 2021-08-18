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


const ctx2 = document.getElementById('myChart2').getContext('2d');
const chart2 = new Chart(ctx2, {
  type: 'doughnut',
  data: {
    //labels: ['Yellow'],
    datasets: [{
      label: 'sentiment',
      data: [0, 0],
      backgroundColor: [
        'rgba(255, 206, 86, 0.2)',
      ],
      borderColor: [
        'rgba(255, 206, 86, 1)',
      ],
      borderWidth: 1
    }]
  }
})

const submitReview = (e) => {
  e.preventDefault();
  const review = document.getElementById('review').value;
  const options = {
    method: 'POST',
    body: JSON.stringify({ review }),
    headers: new Headers({ 'Content-Type': 'application/json' })
  }

  const emojiSection = document.getElementById('emojiSection');
  const title = document.getElementById('title');
  const outline = document.querySelector(':focus');


  fetch('/api/nlp/s-analyzer', options)
    .then(res => res.json())
    .then (({ intensity }) => {
    	console.log(intensity)
      if (intensity.compound <= -0.05) {
        emojiSection.innerHTML = '<img src="https://img.icons8.com/emoji/96/000000/angry-face-emoji--v2.png"/>';
        title.style.color = 'red';
        outline.style.borderColor = 'red';
      };
      if (intensity.compound > -0.05 & intensity.compound < 0.05) {
        emojiSection.innerHTML = '<img src="https://img.icons8.com/officel/80/000000/neutral-emoticon.png">';
        title.style.color = '#00367c';
        outline.style.borderColor = '#00367c';
      }
      if (intensity.compound >= 0.05) {
        emojiSection.innerHTML = '<img src="https://img.icons8.com/color/96/000000/happy.png">';
        title.style.color = 'green';
        outline.style.borderColor = 'green'
      }

      chart.data.datasets.forEach(dataset => {
        dataset.data = [intensity.neg, intensity.neu, intensity.pos]
      })
      chart.update()

      chart2.data.datasets.forEach(dataset => {
        if (intensity.compound < 0) {
          dataset.backgroundColor = ['rgba(255, 99, 132, 0.2)', 'rgba(255, 206, 86, 0.2)']
          dataset.borderColor = ['rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)']
        } else if (intensity.compound === 0) {
          dataset.backgroundColor = ['rgba(255, 206, 86, 0.2)']
          dataset.borderColor = ['rgba(255, 206, 86, 1)']
        } else {
          dataset.backgroundColor = ['rgba(75, 192, 192, 0.2)', 'rgba(255, 206, 86, 0.2)']
          dataset.borderColor = ['rgba(75, 192, 192, 1)', 'rgba(255, 206, 86, 0.2)']
        }
        dataset.data = [intensity.compound, 1-Math.abs(intensity.compound)]
      })
      chart2.update()

    })
    .catch(err => {
      emojiSection.innerHTML = 'There was an error processing your request!'
    })
}

document.getElementById('review').addEventListener('keyup', submitReview);
document.getElementById('reviewForm').addEventListener('submit', submitReview);