<script lang="ts">
    import { onMount,onDestroy } from 'svelte';
    import ApexCharts from 'apexcharts';

  
    let chart: ApexCharts | null = null;

    export let data;

    console.log('data  :', data);

  
    // 데이터와 차트 옵션 정의
    let options = {
      chart: {
        type: 'line',
        height: 350,
      },
      series: [
        {
          name: '온도',
          data: [10, 41, 35],
        },
        {
          name: '습도',
          data: [17, 5, 13],
        },
      ],
      xaxis: {
        categories: ['2024-05-29T12:15:38', '2024-05-29T12:18:39', '2024-05-29T12:19:39']
      },
    };
  
    // 차트가 마운트되면 생성
    onMount(() => {
      chart = new ApexCharts(document.querySelector("#chart"), options);
      chart.render();
    });
  
    // 컴포넌트가 파괴되면 차트 제거
    onDestroy(() => {
      if (chart) {
        chart.destroy();
      }
    });
  </script>
  
  <style>
    #chart {
      max-width: 600px;
      margin: 0 auto;
    }
  </style>
  
  <div id="chart"></div>