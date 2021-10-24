var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "Juli"],
    datasets: [
      {
        label: "The Games",
        data: [65, 59, 80, 81, 90, 100, 70],
        fill: true,
        borderColor: "rgb(50, 75, 220)",
        tension: 0.1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    layout: {
      padding: 20,
    },
  },
});
