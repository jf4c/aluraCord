import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import appConfig from '../config.json';
import { useRouter } from 'next/router'
import React from 'react';

function Titulo(props) {
    // console.log(props.children);
    const Tag = props.tag || 'h1';
    return (
        <>
            <Tag>{props.children}</Tag>
            <style jsx>{`
                ${Tag} {
                    color: ${appConfig.theme.colors.neutrals['000']};
                    font-size: 24px;
                    font-weight: 600;
                }
            `}</style>
        </>

    );
}

// // componente React
// function HomePage() {
//     // jsx
//     return (
//         <div>
//             <GlobalStyle/>
//             <Titulo tag ="h2">Boas Vindas de volta</Titulo>
//             <h2>Discord - Alura Matrix</h2>
//         </div>
    
//     )
//   }

//   export default HomePage

export default function PaginaInicial() {
  // const username = 'jf4c';
  const [username, setUsername] = React.useState('');
  const [userLocation, setUserLocation] = React.useState();
  const roteamento = useRouter();
  // entender essa parte
  React.useEffect(() =>{
    fetch(`https://api.github.com/users/${username}`).then(async (resposta) =>{
      let userData = await resposta.json();
      const userLocation = userData.location;
      setUserLocation(userLocation);
    });
  });
  // entender essa parte
  return (
    <>
      <Box
        styleSheet={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          // backgroundColor: appConfig.theme.colors.primary[500],
          backgroundImage: 'url(https://images.pexels.com/photos/4655892/pexels-photo-4655892.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)',
          backgroundRepeat: 'no-repeat', backgroundSize: '100% 150%', backgroundBlendMode: 'multiply',
        }}
      >

        <Box
          styleSheet={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            width: '100%', maxWidth: '700px',
            borderRadius: '5px', padding: '32px', margin: '16px',
            boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
            backgroundColor: appConfig.theme.colors.neutrals[700],
          }}
        >
          {/* -------------------------------------------Formulário--------------------------------------------- */}
          <Box
            as="form"
            onSubmit={function(infosDoEvento) {
              infosDoEvento.preventDefault();
              console.log('alguém submeteu');
              username.length > 2 ? roteamento.push(`/chat?username=${username}`) : roteamento.push('/404');
            }}
            styleSheet={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
            }}
          >
            <Titulo tag="h2">Boas vindas de volta!</Titulo>
            <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>
              {appConfig.name}
            </Text>
              
            {/* <input 
              type = "text"
              value={username}
              onChange={function handler(event){
                console.log("user digitou", event.target.value);
                // onde esta o valor ?
                const valor = event.target.value;
                //troca o valor da variável no react
                setUsername(valor);
              }}
            /> */}

            <TextField
              value={username}
              onChange={function handler(event){
                console.log("user digitou", event.target.value);
                // onde esta o valor ?
                const valor = event.target.value;
                //troca o valor da variável no react
                setUsername(valor);
              }}
              fullWidth
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                },
              }}
            />
            <Button
              type='submit'
              label='Entrar'
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
          </Box>
          {/* -------------------------------------------------------------------------------------------------- */}
  
          {/* ------------------------------------------Photo Area---------------------------------------------- */}
          <Box 
            styleSheet={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '200px',
              padding: '16px',
              backgroundColor: appConfig.theme.colors.neutrals[800],
              border: '1px solid',
              borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: '10px',
              flex: 1,
              minHeight: '240px',
            }}
          >
            <Image
              styleSheet={{
                borderRadius: '50%',
                marginBottom: '16px',
                
              }}
              src={ username.length > 2 
                ? `https://github.com/${username}.png` 
                : "https://avatars.githubusercontent.com/u/83073691?u=54b510ac99edd1123176172c3f8ac2ad6a20d2cc&v=4"
              }
            />
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[100],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: '3px 10px',
                borderRadius: '1000px'
              }}
            >{
              username.length > 2 
              ? username
              : "dovahkiin"
            }
            </Text>
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[100],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: '3px 10px',
                borderRadius: '1000px'
              }}
            >{ username.length > 2 
              ? userLocation
              : 'Skyrim'
            }
            </Text>

          </Box>
          {/* -------------------------------------------------------------------------------------------------- */}

        </Box>

      </Box>
    </>
  );
}