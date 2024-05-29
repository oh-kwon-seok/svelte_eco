

<script>
	
    // @ts-nocheck
    import '../../../app.postcss';

    import Header from '$lib/components/layout/Header.svelte';
    import SideBar from '$lib/components/layout/SideBar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Title from '$lib/components/layout/Title.svelte';
    

    import { Tabs, TabItem, Timeline, TimelineItem, Button,ButtonGroup,Dropdown,DropdownItem,Input,Label,Select,Search} from 'flowbite-svelte';



    import * as Icon from 'svelte-awesome-icons';

    import {makeCustomTable,select_query} from '$lib/store/sensor/function';
    
    import {url_state,table_list_state,common_toast_state,common_search_state} from '$lib/store/common/state';
    import {EXCEL_CONFIG} from '$lib/module/sales/constants';

    import SearchBar from '$lib/components/layout/SearchBar.svelte'
    import Toast from '$lib/components/toast/Toast.svelte'
    
    import Sensor from '$lib/components/chart/Sensor.svelte'
    
    import {temp_options,humi_options,ph_options,weight_options} from '$lib/store/sensor/state';
   
    import { SearchOutline } from 'flowbite-svelte-icons';
	import { afterUpdate, onMount,onDestroy } from 'svelte';


  import ApexCharts from 'apexcharts';
  
	import moment from 'moment';
            
  
  let temp_chart;
  let humi_chart = null;
  let ph_chart = null;
  let weight_chart = null;

  
    let tableComponent = "example-table-theme";


    onMount(()=>{
        console.log('시점');
       
        makeCustomTable(table_list_state,
        "sensor",
        tableComponent,
        "select",
        temp_chart,
        humi_chart,
        ph_chart,
        weight_chart
      
      );

      console.log(' $temp_options : ',  $temp_options['series'][0]['data']);
   

    });

    afterUpdate(()=> {

        if(data.title === 'redirect'){
            window.location.href = '/';
            alert('잘못된 주소거나 요청시간이 만료되었습니다.');
        }else if($url_state['path'] === '/stats/sensor'){
            console.log('update : ');
            makeCustomTable(table_list_state,"sensor",tableComponent,"select",temp_chart,humi_chart,ph_chart,weight_chart);
       
          }
      
    })

    // 컴포넌트가 파괴되면 차트 제거
    onDestroy(() => {
    
      if (temp_chart) {
        temp_chart.destroy();
      }
      if (humi_chart) {
        humi_chart.destroy();
      }if (ph_chart) {
        ph_chart.destroy();
      }if (weight_chart) {
        weight_chart.destroy();
      }
    });

     
 

 

    </script>
        <style>
          @import 'tabulator-tables/dist/css/tabulator_modern.min.css';

        
    #temp_chart {
      min-width: 540px;
      max-width: 600px;
      margin: 0 auto;
    }
          
    #humi_chart {
      min-width: 540px;
      max-width: 600px;
      margin: 0 auto;
    }
          
    #ph_chart {
      min-width: 540px;
      max-width: 600px;
      margin: 0 auto;
    }
          
    #weight_chart {
      min-width: 540px;
      max-width: 600px;
      margin: 0 auto;
    }


     

        </style>


        
        {#if $common_toast_state['value'] === true}
         <Toast />
        {/if}

        
     
        <Header />

        <div class="grid grid-rows-16 grid-flow-col gap-1">
            <div class="row-span-16"> 
              <SideBar />
            </div>
            <div class="col-span-1 row-span-1"> 
              <Title title='통계 현황' subtitle='센서 데이터 현황'/>
            </div>

        
            
            <div class="row-span-15 col-span-12 "> 
                <Tabs  style="pill" defaultClass=" mt-5 overflow-auto  flex rounded-lg divide-x divide-gray-200 shadow dark:divide-gray-700" >
                    <TabItem  open >
                   

                      <span slot="title">센서 데이터 현황</span>

                
                      <!-- <SearchBar title="sensor" custom={true} query={'select'}/> -->


                      <!-- <form class="flex gap-2"> -->
                      <div class="flex gap-2">
                        <div class="w-1/5">
                          <Label for="first_name" class="mb-2">시작일자</Label>
                          <Input   class="border-2 rounded-md p-2" type="date" id="start_date" placeholder="시작일자를 입력하세요" required bind:value={$common_search_state['start_date']}/>
                      
                        </div>
                        <div class="w-1/5">
                          <Label for="first_name" class="mb-2">종료일자</Label>
                          <Input   class="border-2 rounded-md p-2" type="date" id="end_date" placeholder="종료일자를 입력하세요" required bind:value={$common_search_state['end_date']}/>
                      
                        </div>
                        <div class="w-1/5">
                          <Label for="first_name" class="mb-2">구분</Label>
                          <Select  class="border-2 rounded-md p-2" placeholder="구분을 선택해주세요" items={$common_search_state['filter']} bind:value={$common_search_state['filter_title']}  />
                        
                        </div>
                        <div class="w-2/5">
                        <Label for="search" class="mb-2">검색</Label>
                          
                          <Input  class="border-2 rounded-md p-2" id="search" placeholder="내용을 입력하세요" bind:value={$common_search_state['search_text']}>
                          <SearchOutline slot="left" class="w-6 h-6 text-gray-500 dark:text-gray-400" />
                      
                      
                          <Button slot="right" size="sm" type="submit" on:click={()=> select_query('sensor',temp_chart,humi_chart,ph_chart,weight_chart)}>검색</Button>
                        
                        </Input>
                        </div>
                        <!-- </form> -->
                      </div>

                      <div class='m-5'>

                  
                              

                 
     
    
                      </div>

                      <div id="example-table-theme" bind:this={tableComponent}></div>
                      

                      <div class="flex flex-row">
                       
                        <div id="temp_chart" bind:this={temp_chart}></div>
                      

                        <div id="humi_chart" bind:this={humi_chart}></div>
                   
                      </div>
                      <div class="flex flex-row">
                       
                          <div id="ph_chart" bind:this={ph_chart}></div>
                        <div id="weight_chart" bind:this={weight_chart}></div>

                      </div>

                 
                 

                    </TabItem>
                   
                  
          
                  </Tabs>
                <Footer />
            </div>
         
          </div>
       
        
        
    
    