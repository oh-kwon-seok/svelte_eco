

<script>
	
    // @ts-nocheck
    import '../../../app.postcss';

    import Header from '$lib/components/layout/Header.svelte';
    import SideBar from '$lib/components/layout/SideBar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Title from '$lib/components/layout/Title.svelte';
    

    import { Tabs, TabItem,  Button} from 'flowbite-svelte';
  

    import Util from '$lib/components/modal/restric_material/Util.svelte';
    

    import * as Icon from 'svelte-awesome-icons';

    import {restricMaterialModalOpen,restrictUpdate} from '$lib/store/restric_material/function';
    import {excelDownload} from '$lib/store/common/function';
    
    import {restric_material_modal_state} from '$lib/store/restric_material/state';

    import {url_state,table_list_state,common_toast_state, load_state} from '$lib/store/common/state';
    import {EXCEL_CONFIG} from '$lib/module/common/constants';

    import SearchBar from '$lib/components/layout/SearchBar.svelte'
    import Toast from '$lib/components/toast/Toast.svelte'
    
    import {makeCustomTable,infoCallApi} from '$lib/store/common/function';
    

	import { afterUpdate, onMount } from 'svelte';

  
    // import {TabulatorFull as Tabulator} from 'tabulator-tables';


	import moment from 'moment';
	import Loading from '$lib/components/modal/restric_material/Loading.svelte';
            
  
    export let data;

 
    let tableComponent = "example-table-theme";


    onMount(()=>{
        console.log('시점');
       
        makeCustomTable(table_list_state,"restric_material",tableComponent,"select");

    });

    afterUpdate(()=> {

        if(data.title === 'redirect'){
            window.location.href = '/';
            alert('잘못된 주소거나 요청시간이 만료되었습니다.');
        }else if($url_state['path'] === '/info/restric_material'){
         
          makeCustomTable(table_list_state,"restric_material",tableComponent,"select");
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
              <Title title='거래처 관리' subtitle='매입처 관리'/>
            </div>

          
            
            <div class="row-span-15 col-span-12 "> 
                <Tabs  style="pill" defaultClass=" mt-5 overflow-auto  flex rounded-lg divide-x divide-gray-200 shadow dark:divide-gray-700" >
                    <TabItem  open >
                   

                      <span slot="title">매입처 관리</span>

                
                      <SearchBar title="restric_material"/>


                      <div class='m-5'>

                        
                        {#if $load_state === false}
                          <Button  on:click={() => {restrictUpdate()}}>
                            <Icon.FloppyDiskSolid class='mr-2' size="20" />
                            사용제한 원료 업데이트
                          </Button>

                       
                        {:else if $load_state === true}
                        <Button  on:click={() => {restrictUpdate()}}>
                          <Icon.FloppyDiskSolid class='mr-2' size="20" />
                          사용제한 원료 업데이트
                        </Button>
                        
                          <Loading title={"사용제한 원료 업데이트"} content={"업데이트중..."}/>
                          
                        {/if}

                     


                      

                        <Button  color='red' on:click={() => restricMaterialModalOpen('','check_delete')}>
                          <Icon.BanSolid class='mr-2' size="20" />
                          선택삭제
                        </Button>

                        <Button  color='green' on:click={() =>excelDownload('restric_material',EXCEL_CONFIG['restric_material'])}>
                          <Icon.FileCsvSolid class='mr-2' size="20" />
                          엑셀 다운로드
                      </Button>

                     

            
                      
                        {#if $restric_material_modal_state['title'] === 'update'}
                          <Util  title="update"/>
                          {:else if $restric_material_modal_state['title'] === 'check_delete'}
                          <Util  title="check_delete"/>
                        {/if}
                        

                      </div>

                      <div id="example-table-theme" bind:this={tableComponent}></div>
                    </TabItem> 
                   
                  
          
                  </Tabs>
                <Footer />
            </div>
         
          </div>
       
        
        
    
    