document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const data = JSON.parse(urlParams.get('data'));

    const todayData = data.today;
    const allTimeData = data.all_time;

    const todayChartCanvas = document.getElementById('todayChart').getContext('2d');
    const allTimeChartCanvas = document.getElementById('allTimeChart').getContext('2d');

    new Chart(todayChartCanvas, {
        type: 'pie',
        data: {
            labels: ['Спам', 'Не спам'],
            datasets: [{
                data: [todayData.spam, todayData.non_spam],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)'
                ],
            }],
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const value = tooltipItem.raw;
                            return tooltipItem.label + ': ' + value;
                        }
                    }
                },
                legend: {
                    labels: {
                        color: '#fff'
                    }
                },
                datalabels: {
                    color: '#fff',
                    formatter: (value) => {
                        return value; // Display the number as the label
                    }
                }
            }
        }
    });

    new Chart(allTimeChartCanvas, {
        type: 'pie',
        data: {
            labels: ['Спам', 'Не спам'],
            datasets: [{
                data: [allTimeData.spam, allTimeData.non_spam],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)'
                ],
            }],
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const value = tooltipItem.raw;
                            return tooltipItem.label + ': ' + value;
                        }
                    }
                },
                legend: {
                    labels: {
                        color: '#fff'
                    }
                },
                datalabels: {
                    color: '#fff',
                    formatter: (value) => {
                        return value; // Display the number as the label
                    }
                }
            }
        }
    });
});
