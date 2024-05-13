<script>
    import { Footer, FooterCopyright, FooterLinkGroup, FooterBrand, FooterLink, FooterIcon } from 'flowbite-svelte'
    import {CLIENT_INFO} from '$lib/module/common/constants'
  
  </script>

  <slot>
    <main>

  </main>
</slot>
  
<Footer footerType="socialmedia">
    
    <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
    <div class="sm:flex sm:items-center sm:justify-between">
      <p class="text-slate-500">사업자번호 : {CLIENT_INFO.code} <br/>대표 : {CLIENT_INFO.name} <br/>
        주소 : {CLIENT_INFO.address}<br/>
        TEL : {CLIENT_INFO.tel}<br/>
        FAX : {CLIENT_INFO.fax}

      </p>
      
      
   



    </div>
  </Footer>