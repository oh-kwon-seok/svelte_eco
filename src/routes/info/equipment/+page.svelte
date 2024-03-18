

<script>
	
    // @ts-nocheck
    import '../../../app.postcss';

    import Header from '$lib/components/layout/Header.svelte';
    import SideBar from '$lib/components/layout/SideBar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Title from '$lib/components/layout/Title.svelte';
    

    import { Tabs, TabItem, Timeline, TimelineItem, Button,ButtonGroup,Dropdown,DropdownItem,Input,Label,Select,Search} from 'flowbite-svelte';
    import { ChevronDownSolid, SearchOutline } from 'flowbite-svelte-icons';


    import Util from '$lib/components/modal/equipment/Util.svelte';
    

    import * as Icon from 'svelte-awesome-icons';

    import {equipmentModalOpen,equipmentExcelFormDownload, equipmentExcelUpload} from '$lib/store/equipment/function';
    import {excelDownload, excelUpload, fileButtonClick} from '$lib/store/common/function';
    
    import {equipment_form_state,equipment_modal_state} from '$lib/store/equipment/state';

    import {url_state,cookie_state,common_equipment_state,table_list_state,common_toast_state,common_search_state} from '$lib/store/common/state';
    import {TABLE_COMPONENT,EXCEL_CONFIG} from '$lib/module/common/constants';

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
       
        makeCustomTable(table_list_state,"equipment",tableComponent,"select");

    });

    afterUpdate(()=> {

        if(data.title === 'redirect'){
            window.location.href = '/';
            alert('잘못된 주소거나 요청시간이 만료되었습니다.');
        }else if($url_state['path'] === '/info/equipment'){
         
            makeCustomTable(table_list_state,"equipment",tableComponent,"select");
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
              <Title title='기준정보 관리' subtitle='설비 관리'/>
            </div>

          
            
            <div class="row-span-15 col-span-12 "> 
                <Tabs  style="pill" defaultClass=" mt-5 overflow-auto  flex rounded-lg divide-x divide-gray-200 shadow dark:divide-gray-700" >
                    <TabItem  open >
                   

                      <span slot="title">설비 관리</span>

                
                      <SearchBar title="equipment"/>


                      <div class='m-5'>

                        <Button  on:click={() => {equipmentModalOpen('','add')}}>
                          <Icon.FloppyDiskSolid class='mr-2' size="20" />
                          추가
                        </Button>

                        <Button  color='red' on:click={() => equipmentModalOpen('','check_delete')}>
                          <Icon.BanSolid class='mr-2' size="20" />
                          선택삭제
                        </Button>

                        <Button  color='green' on:click={() =>excelDownload('equipment',EXCEL_CONFIG['equipment'])}>
                          <Icon.FileCsvSolid class='mr-2' size="20" />
                          엑셀다운
                      </Button>
                      
                      <Button  color='green' on:click={(e)=> fileButtonClick('upload')}>
                        <Icon.UploadSolid class='mr-2' size="20" />
                          엑셀 업로드
                        <input 
                        hidden  
                        id = 'upload' 
                        type='file' 
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
                        on:change={(e)=> equipmentExcelUpload(e)}
                  
                        />
                    </Button>
                    <Button  color="light" on:click={() => equipmentExcelFormDownload()}>
                      <Icon.FileExportSolid class='mr-2' size="20" />
                      업로드 양식 다운
                    </Button>

                      

                        {#if $equipment_modal_state['title'] === 'add'}
                          <Util title="add" />
                        {:else if $equipment_modal_state['title'] === 'update'}
                          <Util  title="update"/>
                          {:else if $equipment_modal_state['title'] === 'check_delete'}
                          <Util  title="check_delete"/>
                        {/if}
                        

                      </div>

                      <div id="example-table-theme" bind:this={tableComponent}></div>
                    </TabItem>
                   
                  
          
                  </Tabs>
                <Footer />
            </div>
         
          </div>
       
        
        
    
    