

<script>
	
    // @ts-nocheck
    import '../../../app.postcss';

    import Header from '$lib/components/layout/Header.svelte';
    import SideBar from '$lib/components/layout/SideBar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Title from '$lib/components/layout/Title.svelte';
    

    import { Tabs, TabItem,  Button} from 'flowbite-svelte';
  

    import Util from '$lib/components/modal/department/Util.svelte';
    

    import * as Icon from 'svelte-awesome-icons';

    import {departmentModalOpen} from '$lib/store/department/function';
    import {excelDownload} from '$lib/store/common/function';
    
    import {department_modal_state} from '$lib/store/department/state';

    import {url_state,table_list_state,common_toast_state} from '$lib/store/common/state';
    import {EXCEL_CONFIG} from '$lib/module/common/constants';

    import SearchBar from '$lib/components/layout/SearchBar.svelte'
    import Toast from '$lib/components/toast/Toast.svelte'
    
    import {makeCustomTable,infoCallApi} from '$lib/store/common/function';
    

	import { afterUpdate, onMount } from 'svelte';

  
    // import {TabulatorFull as Tabulator} from 'tabulator-tables';


	import moment from 'moment';
            
  
    export let data;

 
    let tableComponent = "example-table-theme";


    onMount(()=>{
        console.log('시점');
       
        makeCustomTable(table_list_state,"department",tableComponent,"select");

    });

    afterUpdate(()=> {

        if(data.title === 'redirect'){
            window.location.href = '/';
            alert('잘못된 주소거나 요청시간이 만료되었습니다.');
        }else if($url_state['path'] === '/info/department'){
         
          makeCustomTable(table_list_state,"department",tableComponent,"select");
        }
      
    })
     
 

 

    </script>

<style>
  @import 'tabulator-tables/dist/css/tabulator_modern.min.css';

  /* 나머지 스타일 정의 */
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
              <Title title='기준정보 관리' subtitle='부서 관리'/>
            </div>

          
            
            <div class="row-span-15 col-span-12 "> 
                <Tabs  style="pill" defaultClass=" mt-5 overflow-auto  flex rounded-lg divide-x divide-gray-200 shadow dark:divide-gray-700" >
                    <TabItem  open >
                   

                      <span slot="title">부서 관리</span>

                
                      <SearchBar title="department"/>


                      <div class='m-5'>

                        <Button  on:click={() => {departmentModalOpen('','add')}}>
                          <Icon.FloppyDiskSolid class='mr-2' size="20" />
                          추가
                        </Button>

                        <Button  color='red' on:click={() => departmentModalOpen('','check_delete')}>
                          <Icon.BanSolid class='mr-2' size="20" />
                          선택삭제
                        </Button>

                        <Button  color='green' on:click={() =>excelDownload('department',EXCEL_CONFIG['department'])}>
                          <Icon.FileCsvSolid class='mr-2' size="20" />
                          엑셀다운
                      </Button>

                      

                        {#if $department_modal_state['title'] === 'add'}
                          <Util title="add" />
                        {:else if $department_modal_state['title'] === 'update'}
                          <Util  title="update"/>
                          {:else if $department_modal_state['title'] === 'check_delete'}
                          <Util  title="check_delete"/>
                        {/if}
                        

                      </div>

                      <div id="example-table-theme" bind:this={tableComponent}></div>
                    </TabItem>
                   
                  
          
                  </Tabs>
                <Footer />
            </div>
         
          </div>
       
        
        
    
    