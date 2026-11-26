(function(){
var I='assets/img/';
function p(id,name,cat,scent,img,o){return Object.assign({id:id,name:name,category:cat,scent:scent,price:'',oldPrice:'',size:'',burn:'',wax:'Soy wax',wick:'',notes:'',desc:'',badge:'',images:img?[I+img+'.webp']:[],visible:true,soldOut:false},o||{})}
function s(img,kicker,title,text,button,link,focus){return{focus:focus||'center',image:img?I+img+'.webp':'',kicker:kicker,title:title,text:text,button:button||'',link:link||''}}
window.LUNA_DEFAULTS={
version:3,
seo:{title:'Luna Candles African | Soy candles from Zanzibar',description:'Hand-poured soy wax candles made in Zanzibar. Vanilla, spice and fruit scents, gifts and event favours.'},
store:{ordering:true,closedMessage:'We are not taking online orders just now. Please message us.',giftOption:true,askDate:true,deliveryNote:'We will confirm your delivery time and fee before you pay.',notice:''},
chat:{enabled:true,name:'Luna',role:'Your candle matchmaker',delay:'5',
teasers:['Psst… your room says it wants to smell like vanilla.','Still sniffing around? Let us help you pick.','Single, taken or just here for the candles? Chat with me.','Warning: one candle often leads to three.'],
greeting:'Karibu! I am Luna. Three quick questions and I will light your way to the right candle.',
questions:[
{q:'First, the serious one: what is your candle budget?',options:'Just a little treat, Treat myself properly, Money is not a worry today'},
{q:'What should your room smell like?',options:'Sweet like dessert, Spicy like Stone Town, Fresh like the beach, Surprise me'},
{q:'What is the occasion?',options:'Me time, Birthday or gift, Wedding or event, Hotel or business, No reason at all'}],
closing:'Excellent taste. Send this to us on chat and we will match you with your candle.'},

brand:{name:'Luna Candles African',tagline:'Hand-poured soy candles from the heart of Zanzibar',logo:I+'logo.png',mark:I+'mark.png',announcement:'Made by hand in Zanzibar  ✦  Soy wax candles  ✦  Custom gifts and event favours',showAnnouncement:true,splash:true,splashSeconds:'2',currency:'TZS',footer:'Small-batch candles poured by hand in Zanzibar.'},
theme:{gold:'#d99b14',ink:'#1d1d20',grey:'#6c6d73',soft:'#f6f6f7',white:'#ffffff'},
contact:{phone:'',whatsapp:'',email:'',address:'',hours:'',mapLink:'',instagram:'https://www.instagram.com/lunacandleszanzibar',facebook:'',tiktok:''},
payments:[
{name:'M-Pesa',accountName:'',number:'',note:'',enabled:true},
{name:'Tigo Pesa / Mixx by Yas',accountName:'',number:'',note:'',enabled:true},
{name:'Airtel Money',accountName:'',number:'',note:'',enabled:true},
{name:'Bank transfer',accountName:'',number:'',note:'',enabled:true},
{name:'Cash on delivery / pickup',accountName:'',number:'',note:'',enabled:true}],
delivery:[{name:'Pick up at our shop',fee:'0'},{name:'Delivery in Zanzibar',fee:''},{name:'Mainland Tanzania',fee:''},{name:'International',fee:''}],
categories:['Signature','Classic Jars','Minis','Gifts','New'],
currencies:[{code:'TZS',rate:'1',on:true},{code:'USD',rate:'2669',on:true},{code:'KES',rate:'20.54',on:true},{code:'EUR',rate:'2920',on:true},{code:'GBP',rate:'3489',on:true},{code:'UGX',rate:'0.614',on:true}],
posts:[
{title:'From our pouring table',text:'Each jar is wicked, filled and left to set slowly. Patience gives soy wax its smooth, creamy top.',image:I+'pouring.webp',link:'',source:'Journal',date:'',visible:true},
{title:'Spices on top',text:'Cinnamon, star anise and clove, placed by hand while the wax is still soft.',image:I+'spices.webp',link:'',source:'Journal',date:'',visible:true},
{title:'Step inside the shop',text:'Candles on the shelves, woven baskets and hats, and two chairs waiting for you.',image:I+'shop-wide.webp',link:'',source:'Journal',date:'',visible:true}],
journal:{title:'Luna journal',text:'News and moments from our shop and social pages.',count:'6'},
products:[
p('mnemba','Mnemba Escape','Signature','French Vanilla','p-mnemba',{price:'45000',priceSample:true,size:'300g',burn:'About 60 hours',wick:'Wooden wick',badge:'Signature',soon:false,notes:'Vanilla bean, Warm cream, Soft wood',desc:'A warm French vanilla soy candle in a matte black jar. The wooden wick crackles gently while the scent settles into the room. Named for Mnemba, off the coast of Zanzibar, it suits slow evenings and thoughtful gifting.'}),
p('mchangani','Pwani Mchangani','Signature','Cinnamon','p-mchangani',{price:'42000',priceSample:true,size:'300g',burn:'About 60 hours',wick:'Cotton wick',badge:'Spice Island',soon:false,notes:'Cinnamon bark, Star anise, Clove',desc:'Rich cinnamon in a black jar, finished by hand with whole spices on top. A cosy, spicy scent for dining tables and rainy afternoons.'}),
p('vanilla','French Vanilla Glass','Classic Jars','French Vanilla','p-vanilla',{price:'30000',priceSample:true,size:'250g',burn:'About 40 hours',wick:'Wooden wick',badge:'Favourite',soon:false,notes:'Vanilla pod, Sweet cream, Caramel',desc:'Our creamy vanilla in a clear glass jar on a wooden base. Soft and sweet without being heavy, lovely in bedrooms and living rooms.'}),
p('watermelon','Water Melon Glass','Classic Jars','Watermelon','p-watermelon',{price:'30000',priceSample:true,size:'250g',burn:'About 40 hours',wick:'Wooden wick',badge:'Fresh',soon:false,notes:'Juicy melon, Cucumber, Green leaf',desc:'Bright, juicy watermelon with a cool green finish. A cheerful candle for kitchens, bathrooms and sunny rooms.'}),
p('black','Midnight Black Jar','Classic Jars','Sandalwood & Amber','p-black',{price:'28000',priceSample:true,size:'200g',burn:'About 35 hours',wick:'Cotton wick',badge:'',soon:false,notes:'Sandalwood, Amber, Musk',desc:'A deep woody scent in a sleek matte black jar. Calm and understated, made for offices, studies and evening reading.'}),
p('amber','Amber Mini','Minis','Lavender','p-amber',{price:'12000',priceSample:true,size:'60g',burn:'About 12 hours',wick:'Cotton wick',badge:'Mini',soon:false,notes:'Lavender, Chamomile, Soft powder',desc:'A small amber glass jar with a calming lavender scent. Easy to carry, and a sweet party or wedding favour.'}),
p('frosted','Frosted Glow','Classic Jars','Lemongrass','p-frosted',{price:'32000',priceSample:true,size:'250g',burn:'About 45 hours',wick:'Cotton wick',badge:'',soon:false,notes:'Lemongrass, Lime zest, Ginger',desc:'Frosted glass turns the flame into a soft golden glow. A clean citrus scent that freshens a room.'}),
p('gift','Gift Pairing','Gifts','Vanilla & Watermelon','p-gift',{price:'55000',priceSample:true,size:'2 x 250g',burn:'About 40 hours each',wick:'Cotton wick',badge:'Gift',soon:false,notes:'Vanilla, Watermelon, Sweet cream',desc:'Two glass candles paired for someone special: one warm and creamy, one fresh and fruity.'}),
p('new1','Kendwa Sunset','New','Mango & Passion Fruit','',{price:'35000',priceSample:true,size:'250g',burn:'About 45 hours',wick:'Cotton wick',badge:'Coming soon',soon:true,notes:'Ripe mango, Passion fruit, Orange peel',desc:'A golden tropical blend inspired by evenings on the north coast.'}),
p('new2','Stone Town Spice','New','Clove & Nutmeg','',{price:'35000',priceSample:true,size:'250g',burn:'About 45 hours',wick:'Wooden wick',badge:'Coming soon',soon:true,notes:'Clove, Nutmeg, Cardamom',desc:'A warm market-spice blend inspired by the lanes of Stone Town.'}),
p('new3','Paje Breeze','New','Coconut & Lime','',{price:'35000',priceSample:true,size:'250g',burn:'About 45 hours',wick:'Cotton wick',badge:'Coming soon',soon:true,notes:'Coconut milk, Lime, Sea salt',desc:'Light and breezy, like an afternoon by the ocean.'}),
p('new4','Jozani Garden','New','Eucalyptus & Mint','',{price:'35000',priceSample:true,size:'250g',burn:'About 45 hours',wick:'Cotton wick',badge:'Coming soon',soon:true,notes:'Eucalyptus, Spearmint, Green leaf',desc:'A cool leafy scent inspired by the forest.'})],
sections:[
{id:'b-hero',on:true},{id:'features',on:true},{id:'shop',on:true},{id:'b-arch',on:true},{id:'b-spot',on:true},{id:'b-split',on:true},{id:'story',on:true},{id:'journal',on:true},{id:'b-cards',on:true},{id:'b-pattern',on:true},{id:'care',on:true},{id:'gallery',on:true},{id:'b-visit',on:true},{id:'contact',on:true}],
banners:[
{id:'b-hero',label:'Home banner',design:'hero',seconds:'3.5',slides:[
s('shop','Luna Candles African','Light up your home with Zanzibar','Hand-poured soy candles in vanilla, spice and fruit scents.','Shop candles','#shop'),
s('spices','Spices of Zanzibar','Cinnamon, clove and star anise','Finished by hand with real whole spices.','Explore spice','#shop'),
s('p-mnemba','Signature collection','Mnemba Escape','French vanilla with a crackling wooden wick.','Shop signature','#shop'),
s('lounge','Our shop','Come and smell the island','Take a seat and choose the scent that feels like you.','Visit us','#contact')]},
{id:'b-arch',label:'Scent cards',design:'cards',seconds:'4',slides:[
s('p-vanilla','Classic','French Vanilla','Soft and creamy.','Shop','#shop'),s('p-watermelon','Fresh','Water Melon','Light and fruity.','Shop','#shop'),s('p-mchangani','Spiced','Pwani Mchangani','Warm cinnamon.','Shop','#shop'),s('p-amber','Little joys','Amber Minis','Perfect favours.','Shop','#shop'),s('p-frosted','Glow','Frosted Glass','Golden light.','Shop','#shop')]},
{id:'b-spot',label:'Signature spotlight',design:'boxed',seconds:'4',slides:[
s('mnemba-wide','From the heart of Zanzibar','An island escape in a jar','Light the wooden wick, hear it crackle and let vanilla fill the room.','Discover','#shop'),
s('p-mchangani','Spice Island','The warmth of Mchangani','Cinnamon with whole spices set into the wax.','Discover','#shop')]},
{id:'b-split',label:'Workshop split',design:'split',seconds:'3.5',slides:[
s('maker','Behind the flame','Good wax, good oils, patient hands','We measure, blend and pour each candle ourselves.','Ask about custom orders','#contact'),
s('jars','Your vessel, your scent','Custom batches','Black, amber, frosted or clear: tell us what you have in mind.','Start an order','#contact'),
s('pouring','Poured with care','From pot to jar','Hand poured and left to set before it reaches you.','Shop now','#shop')]},
{id:'b-cards',label:'Wide photo cards',design:'wide',seconds:'3',slides:[
s('p-black','Everyday','Black jar series','','Shop','#shop'),s('lounge','Sit with us','The shop lounge','','Visit','#contact'),s('p-gift','Gifting','Pairs and sets','','Shop','#shop'),s('spices','Decorated','Spice tops','','Shop','#shop'),s('shop-wide','Browse','Candles and woven goods','','Visit','#contact')]},
{id:'b-pattern',label:'Gifts and events',design:'fade',seconds:'4',slides:[
s('jars','Weddings and events','Favours your guests will keep','Candles with your names, colours and date.','Request a quote','#contact'),
s('shop-wide','Corporate gifting','Thank your team with light','Branded jars for hotels, lodges and companies.','Request a quote','#contact'),
s('lounge','Hotels and lodges','Your signature scent','Ask us about repeat batches for rooms and spas.','Talk to us','#contact')]},
{id:'b-visit',label:'Visit our shop (framed)',design:'frame',seconds:'4',slides:[
s('storefront','Find us','Look for the maroon sign','Luna Candles African, Zanzibar.','Get directions','#contact','top'),
s('shop-wide','Step inside','Candles, hats and baskets','A warm little shop full of local craft.','Contact us','#contact'),
s('lounge','Stay a while','Take a seat and choose your scent','','Contact us','#contact')]}],
features:[{icon:'hand',title:'Hand poured',text:'Small batches'},{icon:'leaf',title:'Soy wax',text:'Plant based'},{icon:'pin',title:'Made in Zanzibar',text:'Island crafted'},{icon:'gift',title:'Custom gifts',text:'Events and brands'}],
shopHeading:{title:'Our candles',text:'Pick a scent, tap a candle for details.'},
story:{kicker:'Our story',title:'Light with an African soul',text:'Luna Candles African makes soy wax candles by hand in Zanzibar. We love warm vanilla, island spices and bright fruit, set in jars you will want to keep.\n\n(Add your own story here: who started Luna, when, and why.)',images:[I+'pouring.webp',I+'maker.webp']},
care:[{icon:'clock',title:'First burn',text:'Let the whole top melt to the edges, about 2 hours.'},{icon:'cut',title:'Trim the wick',text:'Keep it about 5mm before each light.'},{icon:'wind',title:'Avoid drafts',text:'Keep away from fans and open windows.'},{icon:'flame',title:'Burn safely',text:'Never leave a flame unattended, 4 hours at most.'}],
gallery:['shop','p-mnemba','pouring','p-mchangani','storefront','jars','p-vanilla','lounge'].map(function(n){return I+n+'.webp'})
};
})();
