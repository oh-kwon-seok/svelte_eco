

<script>
	
    // @ts-nocheck
    import '../../../app.postcss';

    import Header from '$lib/components/layout/Header.svelte';
    import SideBar from '$lib/components/layout/SideBar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Title from '$lib/components/layout/Title.svelte';
    

    import { Tabs, TabItem, Timeline, TimelineItem, Button,ButtonGroup,Dropdown,DropdownItem,Input,Label,Select,Search} from 'flowbite-svelte';
    import { ChevronDownSolid, SearchOutline } from 'flowbite-svelte-icons';


    import Util from '$lib/components/modal/process/Util.svelte';
    

    import * as Icon from 'svelte-awesome-icons';

    import {processModalOpen,processExcelFormDownload,processExcelUpload,processQcExcelUpload,processQcExcelFormDownload} from '$lib/store/process/function';
    import {excelDownload, excelUpload, fileButtonClick,makeCustomTable} from '$lib/store/common/function';
    
    import {process_form_state,process_modal_state} from '$lib/store/process/state';

    import {url_state,cookie_state,common_process_state,table_list_state,common_toast_state,common_search_state} from '$lib/store/common/state';
    import {TABLE_COMPONENT,EXCEL_CONFIG} from '$lib/module/common/constants';

    import SearchBar from '$lib/components/layout/SearchBar.svelte'
    import Toast from '$lib/components/toast/Toast.svelte'
    
    //import {makeCustomTable,infoCallApi} from '$lib/store/common/function';

    

	import { afterUpdate, onMount } from 'svelte';

  
    // import {TabulatorFull as Tabulator} from 'tabulator-tables';

  
	import moment from 'moment';
            
  
    export let data;

 
    let tableComponent = "example-table-theme";


    onMount(()=>{
        console.log('시점');
       
        makeCustomTable(table_list_state,"process",tableComponent,"select");

    });

    afterUpdate(()=> {

        if(data.title === 'redirect'){
            window.location.href = '/';
            alert('잘못된 주소거나 요청시간이 만료되었습니다.');
        }else if($url_state['path'] === '/info/process'){
         
            makeCustomTable(table_list_state,"process",tableComponent,"select");
        }
      
    })
     
 

 

    </script>
        <style>
          @import 'tabulator-tables/dist/css/tabulator_modern.min.css';
          /* #example-table-theme{
    background-color:#ccc;
    border: 1px solid #333;
    border-radius: 10px;
}


#example-table-theme .tabulator-header {
    background-color:#333;
    color:#fff;
}


#example-table-theme .tabulator-header .tabulator-col,
#example-table-theme .tabulator-header .tabulator-col-row-handle {
    white-space: normal;
}


#example-table-theme .tabulator-tableholder .tabulator-table .tabulator-row{
    color:#fff;
    background-color: #666;
}


    #example-table-theme .tabulator-tableholder .tabulator-table .tabulator-row:nth-child(even) {
    background-color: #444;
} */


     

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
              <Title title='기준정보 관리' subtitle='공정 관리'/>
            </div>

          
            
            <div class="row-span-15 col-span-12 "> 
                <Tabs  style="pill" defaultClass=" mt-5 overflow-auto  flex rounded-lg divide-x divide-gray-200 shadow dark:divide-gray-700" >
                    <TabItem  open >
                   

                      <span slot="title">공정 관리</span>

                
                      <SearchBar title="process"/>


                      <div class='m-5'>

                        <Button  on:click={() => {processModalOpen('','add')}}>
                          <Icon.FloppyDiskSolid class='mr-2' size="20" />
                          추가
                        </Button>

                        <Button  color='red' on:click={() => processModalOpen('','check_delete')}>
                          <Icon.BanSolid class='mr-2' size="20" />
                          선택삭제
                        </Button>

                        <Button  color='green' on:click={() =>excelDownload('process',EXCEL_CONFIG['process'])}>
                          <Icon.FileCsvSolid class='mr-2' size="20" />
                          엑셀다운
                      </Button>
                      
                      <Button  color='green' on:click={(e)=> fileButtonClick('upload')}>
                        <Icon.UploadSolid class='mr-2' size="20" />
                          공정 업로드
                        <input 
                        hidden  
                        id = 'upload' 
                        type='file' 
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
                        on:change={(e)=> processExcelUpload(e)}
                  
                        />
                    </Button>
                    <Button  color='green' on:click={(e)=> fileButtonClick('upload1')}>
                      <Icon.UploadSolid class='mr-2' size="20" />
                        공정검사 업로드
                      <input 
                      hidden  
                      id = 'upload1' 
                      type='file' 
                      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
                      on:change={(e)=> processQcExcelUpload(e)}
                
                      />
                  </Button>
                    <Button  color="light" on:click={() => processExcelFormDownload()}>
                      <Icon.FileExportSolid class='mr-2' size="20" />
                      공정 업로드 양식 다운
                    </Button>
                    <Button  color="light" on:click={() => processQcExcelFormDownload()}>
                      <Icon.FileExportSolid class='mr-2' size="20" />
                      공정검사 업로드 양식 다운
                    </Button>


                      

                        {#if $process_modal_state['title'] === 'add'}
                          <Util title="add" />
                        {:else if $process_modal_state['title'] === 'update'}
                          <Util  title="update"/>
                          {:else if $process_modal_state['title'] === 'check_delete'}
                          <Util  title="check_delete"/>
                        {/if}
                        

                      </div>

                      <div id="example-table-theme" bind:this={tableComponent}></div>
                    </TabItem>
                   
                  
          
                  </Tabs>
                <Footer />
            </div>
         
          </div>
       
        
        
    
    