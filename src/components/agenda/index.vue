<template>
   <!-- site wrapper   style="background-color: #e22b18;-->
    <div class="site-wrapper">

      <header class="header" style="position:fixed;top:0px;left:180px;z-index:1">
        <img style="position: absolute;left: 14px;top: 20px;" src="/Content/images/logo4.png" />
      </header>
      <!-- header -->
      <header class="left float-left shadow-dark" id="header">

        <div class="header-inner d-flex align-items-start flex-column">
          <a class="site-title">拍卖会竞价议程</a>
          <span class="site-slogan">厦门市自然资源和规划局</span>
          <nav>
            <ul class="vertical-menu scrollspy">
              <li v-on:click="handleClickHref(0)">
                <a class="active">首页</a>
              </li>

              <li v-for="(item,index) in list" style="cursor:pointer;" v-on:click="handleClickHref(index+1)">
                <a> {{item.href}}</a>
              </li>

            </ul>
          </nav>
        </div>
      </header>
      <!-- main content area  style="background-color:#ffd23c;color:#000" -->
      <main class="content float-right">
        <!-- section hero -->
        <section class="agenda-item shadow-blue padding-50"
                 id="home" style="background-color:#c02529;height:640px;color: #F6F7FF;font-weight:600">
          <div class="overlay bg-title"> </div>
          <div style="font-size:56px;margin:60px 0 20px 0;">欢迎</div>
          <div style="margin:20px 0;letter-spacing:2px">
            <span style="font-size:48px;">{{userName}}</span>
            <span style="font-size:32px">莅临</span>
          </div>
          <div style="font-size:32px;margin-bottom:140px;letter-spacing:4px">国有建设用地使用权拍卖会</div>

          <div class="text-center" v-on:click="handleClickEnter">
            <a class="btn btn-border-light btn-lg" style="width:200px">进入...</a>
          </div>

        </section>

        <div v-show="visible"  >
          <v-agenda-item  v-for="(item,index) in list"
                         :id="'agenda'+(index+0)"
                         class="agenda-item"
                         :nextId="'agenda'+(index+1)"
                         v-on:click="handleClickHref(index+2)"
                         :title="item.title"
                         :btn="item.btn"
                         :html="item.html">
          </v-agenda-item>
        </div>

        <section style="height:700px"></section>
      </main>
    </div>

</template>


<style scoped>

main.content {
    margin-bottom: 50px;
    width: 875px;
    -webkit-transform: translateX(0);
    -moz-transform: translateX(0);
    -ms-transform: translateX(0);
    -o-transform: translateX(0);
    transform: translateX(0);
    -webkit-transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
    z-index: 2;
}

    main.content.push {
        -webkit-transform: translateX(295px);
        -moz-transform: translateX(295px);
        -ms-transform: translateX(295px);
        -o-transform: translateX(295px);
        transform: translateX(295px);
    }



/*=================================================================*/
/*                      HEADER       #ffd23c                        /*=================================================================*/
header.left {
    color: #FFF;
    background-color: #c02529;
    border-radius: 20px;
    min-height: 640px;
    max-height: 640px;
    top: 80px;
    overflow: hidden;
    position: fixed;
    width: 265px;
    -webkit-transform: translateX(0);
    -moz-transform: translateX(0);
    -ms-transform: translateX(0);
    -o-transform: translateX(0);
    transform: translateX(0);
    -webkit-transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
}

    header.left nav {
        margin-top: 40px;
    }

    header.left .header-inner {
        width: 100%;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 30px;
        position: absolute;
    }

    header.left button.close {
        display: none;
        outline: none;
        padding: 0;
        background-color: #FFF;
        border: 0;
        -webkit-appearance: none;
        opacity: 1;
        color: #FF5959;
        font-weight: 400;
        font-size: 16px;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        line-height: 22px;
        margin-top: 16px;
        margin-right: 18px;
        position: relative;
        z-index: 1;
    }

header a {
    color: #FFF;
}

    header a:hover {
        color: #FFF;
        text-decoration: none;
    }

header .site-title {
    display: block;
    font-size: 28px;
    font-weight: 700;
}

    header .site-title.dot:after {
        content: "";
        background-color: #FF5959;
        border-radius: 50%;
        display: inline-block;
        margin-left: 5px;
        height: 8px;
        width: 8px;
    }

header .site-slogan {
    font-size: 14px;
    text-transform: uppercase;
}

header .vertical-menu {
    font-size: 16px;
    font-weight: 600;
    font-family: "Poppins", sans-serif;
    list-style: none;
    padding: 0;
    margin: 0;
}

    header .vertical-menu i {
        margin-right: 20px;
    }

    header .vertical-menu li {
        line-height: 2.5;
        position: relative;
    }

        header .vertical-menu li a {
            margin-left: 0;
            padding: 0;
            -webkit-transition: all 0.3s ease-in-out;
            -moz-transition: all 0.3s ease-in-out;
            transition: all 0.3s ease-in-out;
        }

            header .vertical-menu li a:hover {
                margin-left: 5px;
            }

            header .vertical-menu li a.active:before {
                content: "";
                background: #FF5959;
                display: block;
                height: 18px;
                left: -30px;
                top: 7px;
                position: absolute;
                width: 3px;
            }

section {
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    margin-top: 80px;
}

    section.white-bg {
        background: #FFF;
    }


    section.padding-50 {
        padding: 50px;
        border: 1px solid #eee;
    }

.section-title {
    margin: 0;
}

    .section-title:after {
        content: "";
        background: #FF5959;
        border-radius: 25px;
        display: block;
        height: 5px;
        margin-top: 14px;
        width: 30px;
    }

.shadow-blue {
    -webkit-box-shadow: 0px 6px 15px 0px rgba(74, 99, 231, 0.1);
    -moz-box-shadow: 0px 6px 15px 0px rgba(74, 99, 231, 0.1);
    box-shadow: 0px 6px 15px 0px rgba(74, 99, 231, 0.1);
}

.shadow-dark {
    -webkit-box-shadow: 0px 6px 15px 0px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0px 6px 15px 0px rgba(0, 0, 0, 0.2);
    box-shadow: 0px 6px 15px 0px rgba(0, 0, 0, 0.2);
}

.btn {
    border-radius: 100px;
    font-size: 16px;
    padding: 12px 26px;
    -webkit-transform: translateY(0);
    -moz-transform: translateY(0);
    -ms-transform: translateY(0);
    -o-transform: translateY(0);
    transform: translateY(0);
    -webkit-transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
}

.btn-default {
    color: #FFF;
    font-weight: 600;
    background: #c02529;
}

    .btn-default:hover {
        background: #4A63E7;
        color: #FFF;
        -webkit-transform: translateY(-3px);
        -moz-transform: translateY(-3px);
        -ms-transform: translateY(-3px);
        -o-transform: translateY(-3px);
        transform: translateY(-3px);
        -webkit-box-shadow: 0px 8px 15px 0px rgba(0, 0, 0, 0.2);
        -moz-box-shadow: 0px 8px 15px 0px rgba(0, 0, 0, 0.2);
        box-shadow: 0px 8px 15px 0px rgba(0, 0, 0, 0.2);
    }

.btn-alt {
    color: #FFF;
    background: #4A63E7;
}

    .btn-alt:hover {
        color: #FFF;
        background: #FF5959;
        -webkit-transform: translateY(-3px);
        -moz-transform: translateY(-3px);
        -ms-transform: translateY(-3px);
        -o-transform: translateY(-3px);
        transform: translateY(-3px);
        -webkit-box-shadow: 0px 8px 15px 0px rgba(0, 0, 0, 0.2);
        -moz-box-shadow: 0px 8px 15px 0px rgba(0, 0, 0, 0.2);
        box-shadow: 0px 8px 15px 0px rgba(0, 0, 0, 0.2);
    }

.btn-border {
    color: #FFF;
    background: #4A63E7;
}

    .btn-border:hover {
        color: #FFF;
        background: #000;
    }

.btn-border-light {
    color: #FFF;
    border: solid 1px #FFF;
    background: transparent;
}

    .btn-border-light:hover {
        color: #000;
        background: #FFF;
        -webkit-transform: translateY(-3px);
        -moz-transform: translateY(-3px);
        -ms-transform: translateY(-3px);
        -o-transform: translateY(-3px);
        transform: translateY(-3px);
        -webkit-box-shadow: 0px 8px 15px 0px rgba(0, 0, 0, 0.2);
        -moz-box-shadow: 0px 8px 15px 0px rgba(0, 0, 0, 0.2);
        box-shadow: 0px 8px 15px 0px rgba(0, 0, 0, 0.2);
    }

.btn-full {
    text-align: center;
    width: 100%;
}

.btn-group-lg > .btn,
.btn-lg {
    padding: 12px 26px;
    font-size: 16px;
}



.float-left {
    float: left !important
}

.float-right {
    float: right !important
}

.float-none {
    float: none !important
}

.site-wrapper {
    width: 1170px;
    margin-left: auto;
    margin-right: auto;
}

.overlay {
    border-radius: 20px;
    background: #c02529;
    left: 0;
    top: 0;
    position: absolute;
    opacity: 0.3;
    height: 100%;
    width: 100%;
}


.bg-title {
    background: url(../Images/about-bg.png);
    /*background: url(../Images/property-bg.jpg);*/
    background-repeat: no-repeat;
    background-position: bottom;
    background-size: 860px auto;
    /*background-attachment: fixed;*/
}

.bg-content {
    background: url(../Images/background-outer-wrapper.png);
    background-repeat: no-repeat;
    background-position: bottom;
    background-size: 860px auto;
}
</style>