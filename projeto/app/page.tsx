import Image from "next/image";
import './unique.css'
import './responsive-unique.css'
import { headers } from 'next/headers'


export default async function Home() {
  const headersList = await headers() // pega o header, que são informações do navegador
  const userAgent = headersList.get('user-agent') || '' //retorna uma string com as informações
  
  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent) // faz uma pesquisa na string de tudo que pode indicar ser mobile
  // usar o isMobile para chamar o número de torneios iniciais necessários, mudar essa diferenciação depois, atualmente se está usando display none pelo css 

  return (
    <>
      <div id="herobar">
        <img src="/logo.png" alt="logo"/>
        <div>
          <h1 >"O xadrez é a gisnástica da inteligência"</h1>
          <h2>- Johann Wolfgang</h2>
        </div>
      </div>
      
      <div id="comparation">
        <h1 >Bem-vindo ao Sombrio Xadrez Clube!!!</h1>
        <h2 style={{paddingBottom: '10px'}}>Promovendo o xadrez há mais de 20 anos</h2>
        <div>
          <img src="/images/comp1.png" alt="comp1" />
          <img src="/images/comp2.png" alt="comp2" />
        </div>
      </div>
      
      <div id="slider">
        <h1 >Trazendo torneios que criam amizades!</h1>
        <div className="track">
          <div className="set">
            <img src="/images/slider1/img2.png" alt="img2" />
            <img src="/images/slider1/img1.png" alt="img1" />
            <img src="/images/slider1/img2.png" alt="img2" />
            <img src="/images/slider1/img3.png" alt="img3" />
          </div>

          <div className="set">
            <img src="/images/slider1/img2.png" alt="img2" />
            <img src="/images/slider1/img1.png" alt="img1" />
            <img src="/images/slider1/img2.png" alt="img2" />
            <img src="/images/slider1/img3.png" alt="img3" />
          </div>
        </div>
      </div>
      
      <div id="tournaments">
        <h1>Torneios abertos para inscrição</h1>


        {Array.from({ length: 2 }).map((_, i) => (
          // i é o número de repetição do negócio
          <div className="tournament" key={i}>
            <div className="contentImg">
              <div className="content">
                <h3>IV TORNEIO BLITZ SOMBRIO</h3>
                <p>
                  Tempo: 3 + 5 (digital) / 10 + 0 (analógico) <br />
                  <br />
                  Local: CITI, Rua João Goularte, Sombrio. <br />
                  <br />
                  Encerramento das inscrições:<br />
                  Data: 28/08/2025&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hora:  18:00<br />
                  <br />
                  Início:<br />
                  Data: 28/08/2025&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hora: 18:30<br />
                  <br />
                  Valor: R$10,00 - R$25,00
                </p>
              </div>
              <img src="/folderteste.jpeg" alt="torneio" />
            </div>
            <div className="buttons">
              <div>
                <a href="#" className="button red">Inscreva-se</a>
              </div>
              <div style={{flexDirection: 'column', width: 'min-content'}}>
                <a href="#" className="button black">Inscrição em grupo</a>
                <p className="obs">*Há descontos disponíveis para determinados volumes de inscrições.</p>
              </div>
            </div>
          </div>  
        ))}

          <div id="pbuttons">
            <a href="#" className="button red big">Vertodos os torneios</a>
            <a href="#" className="button black big">Ver histórico de eventos</a>
          </div>
      </div>
      
      <div id="founders">

        <h1>Conheça nossos fundadores</h1>
        <h2>Aqueles que fizeram tudo acontecer</h2>
        <div id="img-founders">
          <div>
            <img src="/images/f1.png" alt="f" />
            <h3>Athauan Machado</h3>
          </div>
          <div>
            <img src="/images/f2.png" alt="f" />
            <h3>Mateus de Souza</h3>
          </div>
          <div>
            <img src="/images/f3.png" alt="f" />
            <h3>Thiago Godinho</h3>
          </div>
          <div>
            <img src="/images/f4.png" alt="f" />
            <h3>Chesman Emerim</h3>
          </div>
          <div>
            <img src="/images/f5.png" alt="f" />
            <h3>José <br/> Carlos</h3>
          </div>
          <div>
            <img src="/images/f6.png" alt="f" />
            <h3>Lucas de Souza</h3>
          </div>
        </div>

      </div>

      <div id="history">
        <div id="img">
          <img src="/images/img-our-history.png" alt="" />
        </div>
        
        <div id="p-content">
          <div>
            <h1 style={{marginBottom: '20px'}}>Nossa história</h1>
            
            <p>Fundado em 07 de julho de 2003 por Mateus de Souza, Chesman Emerin, Athauan Machado, Thiago Godinho, José Carlos e Lucas de Souza. O Sombrio Xadrez Clube nasceu em Sombrio (SC) com o objetivo de difundir o amor pelo xadrez.</p>

            <p>Em 2023, o clube celebrou seus 20 anos de história, reunindo jogadores de todas as idades em eventos especiais. Ao longo das décadas, tornou-se referência regional, promovendo torneios e aulas para iniciantes e avançados.</p>

            <p style={{marginBottom: '40px'}}>Hoje, o Sombrio Xadrez Clube continua sendo um espaço de aprendizado, estratégia e amizade.</p>

            <button className="button red">Ver história completa</button>
          </div>
        </div>
      </div>

      <div id="origins">
        <h1>Voltando às origens</h1>
        <h2 style={{marginBottom: '20px'}} >Relembrando antigos momentos de felicidade</h2>

        <div className="track rigth" style={{marginBottom: '20px'}}>
          <div className="set">
            <img src="/images/slider1/img2.png" alt="img2" />
            <img src="/images/slider1/img1.png" alt="img1" />
            <img src="/images/slider1/img2.png" alt="img2" />
            <img src="/images/slider1/img3.png" alt="img3" />
          </div>

          <div className="set">
            <img src="/images/slider1/img2.png" alt="img2" />
            <img src="/images/slider1/img1.png" alt="img1" />
            <img src="/images/slider1/img2.png" alt="img2" />
            <img src="/images/slider1/img3.png" alt="img3" />
          </div>
        </div>


        <div style={{width: '100%', flexDirection: 'column', alignItems: 'end'}}>

          <div className="track left">
            <div className="set">
              <img src="/images/slider1/img2.png" alt="img2" />
              <img src="/images/slider1/img1.png" alt="img1" />
              <img src="/images/slider1/img2.png" alt="img2" />
              <img src="/images/slider1/img3.png" alt="img3" />
            </div>

            <div className="set">
              <img src="/images/slider1/img2.png" alt="img2" />
              <img src="/images/slider1/img1.png" alt="img1" />
              <img src="/images/slider1/img2.png" alt="img2" />
              <img src="/images/slider1/img3.png" alt="img3" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
