const cheerio = require('cheerio'); // khai báo module cheerio
const request = require('request-promise'); // khai báo module request-promise

function empty(e) {
    switch (e) {
      case "":
      case 0:
      case "0":
      case null:
      case false:
      case typeof(e) == "undefined":
        return true;
      default:
        return false;
    }
}

function leak(begin, end)
{
    for(var i = begin; i <= end; i++)
    {
        request('https://app.vaz.vn/san-pham/' + i, (error, response, html) => { // gửi request đến trang 
            if(!error && response.statusCode == 200){ // 200, kiểm tra xem kết nối thành công không :D
                const $ = cheerio.load(html); // load HTML
                const link = $(".box-intro > div > a").attr('href');
                getData(link)
            }
            else {
                console.log(error);
            }
        });  
    }
}

function getData(link)
{
    if(link == undefined) return
    request(link, (error, response, html) => { // gửi request đến trang 
        if(!error && response.statusCode == 200){ // 200, kiểm tra xem kết nối thành công không :D
            const $ = cheerio.load(html); // load HTML
            const img = $(".avatar > img").attr('src');
            const id = img.replace('https://app.vaz.vn/uploads/avatars/', '').split('_')[0]
            const linksp = $(".box-intro > div > a").attr('href')
            const name = $(".fullname").text();
            const phone = $(".box-contact > a").attr('href').split(':')[1];
            const email = $(".box-intro").html().split('<p>Email: ')[1].split('</p> -->')[0]
            
            data.vaz_vn.push({
                Id_Product: id,
                Link_Product: linksp,
                Link_Info: link,
                Image:img,
                Name:name,
                Phone:phone,
                Email:email})

            var fs = require('fs');
            fs.writeFile ("leak1.json", JSON.stringify(data), function(err) {
                if (err) throw err;
                console.log('complete');
                }
            );
            //sleep(1000);
        }
        else {
            console.log(error);
        }
    });
}

var data = {vaz_vn:[]}
leak(0, 3000)