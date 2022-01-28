import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_ANNON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMwNjQ2OCwiZXhwIjoxOTU4ODgyNDY4fQ.Ngwo_u7ttepeaFQd6DWUh_JIylM-omFmHz3e_7VAIc8'
const SUPABASE_URL = 'https://cctjqtusltrpikkvwsua.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANNON_KEY);

supabaseClient
    .from('mensagens')
    .select('*')
    .then((dados) => {
        console.log(dados);
    })

export default function ChatPage() {
   const [mensagem, setMensagem] = React.useState('');
   const [listaDeMensagem, setListaDeMensagem] = React.useState([]);
   
    React.useEffect(()  => {
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', {ascending: false})
            .then(({data, }) => {
                setListaDeMensagem(data)
            });
    }, []);
   // Sua lógica vai aqui
    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            // id: listaDeMensagem.length + 1,
            de: 'dovahkiin',
            texto: novaMensagem,
        };

        supabaseClient
            .from('mensagens')
            .insert([
                mensagem
            ])
            .then(({ data }) => {
                setListaDeMensagem([
                    data[0],
                    ...listaDeMensagem,
                ]);
                
            });

        setMensagem('');
    }
    // ./Sua lógica vai aqui
   
    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundImage: `url(https://images.pexels.com/photos/4655892/pexels-photo-4655892.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)`,
                backgroundRepeat: 'no-repeat', backgroundSize: '100% 150%', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals["0700"],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals["0500"],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList mensagens={listaDeMensagem} />
                    
                    {/* {listaDeMensagem.map((mensagemAtual) => {
                        console.log(mensagemAtual)
                        return (
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    })} */}

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) =>{

                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                if(event.key === 'Enter') {
                                    event.preventDefault();
                                    // console.log(event);
                                    handleNovaMensagem(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        
                        <Image styleSheet={{
                            backgroundColor:appConfig.theme.colors.neutrals[500],
                            borderRadius:'100%', 
                            padding: '2px',
                            width: '40px',
                            height: '40px',
                            transition: '0.5s',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[100],
                            },
                            }}
                            onClick ={() => {
                                handleNovaMensagem(mensagem);
                            }}
                            src ={"https://icon-library.com/images/fly_send_paper_submit_plane-512.png"}
                            colorVariant='neutral'
                            
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', 
            marginBottom: '16px',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            backgroundColor: appConfig.theme.colors.neutrals["0500"], 
            padding: '3px',
            
            }} >
                
                <Text variant='heading5' styleSheet={{paddingLeft: '10px',paddingTop: '5px',}}>
                    chat
                </Text>
                
                <Button styleSheet={{
                backgroundColor: appConfig.theme.colors.neutrals["700"], 
                }}
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    console.log('MessageList', props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return(
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals["0700"],
                                
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                                display: 'flex',
                                alignItems:'center',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                // src={`https://avatars.githubusercontent.com/u/83073691?u=54b510ac99edd1123176172c3f8ac2ad6a20d2cc&v=4`}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text 
                                tag="strong"
                                styleSheet={{
                                    // display: 'flex',
                                }} 
                            >
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>

                        
                        </Box>
                        {mensagem.texto}
                    </Text>

                );
            })}

        </Box>
    )
}