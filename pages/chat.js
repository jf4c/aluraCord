import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'
import { ButtonSendSticker } from '../src/componentes/buttonSendStickes'
// import next from 'next';

const SUPABASE_ANNON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMwNjQ2OCwiZXhwIjoxOTU4ODgyNDY4fQ.Ngwo_u7ttepeaFQd6DWUh_JIylM-omFmHz3e_7VAIc8'
const SUPABASE_URL = 'https://cctjqtusltrpikkvwsua.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANNON_KEY);

function escutaMensagemEmTempoReal(adicionaMensagem){
    return supabaseClient
        .from('mensagens')
        .on('INSERT',(respostaLive) =>{
            adicionaMensagem(respostaLive.new);
        })
        .subscribe();
}



async function deletaMensagemSupabase(idMensagem) {
    const mensagemDelete = await supabaseClient
            .from('mensagens')
            .delete()
            .match({id:idMensagem})

}

supabaseClient
    .from('mensagens')
    .select('*')
    .then((dados) => {
        // console.log(dados);
    })

export default function ChatPage() {

    const roteamento = useRouter();
    const userLog = roteamento.query.username;
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

        escutaMensagemEmTempoReal((novaMensagem) =>{
            setListaDeMensagem((valorAtualDaLista) => {
                return[
                novaMensagem,
                ...valorAtualDaLista,
                ]
            });
        });

    }, []);

    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            de: userLog,
            texto: novaMensagem,
        };

        supabaseClient
            .from('mensagens')
            .insert([
                mensagem
            ])
            .then(({ data }) => {   
            });

        setMensagem('');
    }
   
    return (
        <Box
        
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '1px', // => Não sei o pq mas funciona

                backgroundImage: `url(https://images.pexels.com/photos/4655892/pexels-photo-4655892.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)`,
               
                backgroundRepeat: 'no-repeat', backgroundSize: '100% 150%', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000'],
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


                    <MessageList mensagens={listaDeMensagem} setListaDeMensagem={setListaDeMensagem}/>
                

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            justifyContent: 'center'
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

                        <Button
                            styleSheet={{
                                backgroundColor:appConfig.theme.colors.neutrals[800],
                                maxWidth: '45px',
                                maxHeight: '45px',
                            }}
                            iconName="arrowRight"
                            colorVariant='neutral'
                            onClick ={() => {
                                handleNovaMensagem(mensagem);
                            }}
                        />
                    </Box>
                    <Box 
                        styleSheet={{
                            // display: 'inline',
                            position: 'absolute',
                            bottom: '32px',
                            right: '80px',
                            marginLeft:'auto',
                            width: '30px',
                            height:'30px',
                        }}
                    >
                        <ButtonSendSticker 
                            onStickerClick={(sticker) => {
                                handleNovaMensagem(':sticker:' + sticker);
                            }}  
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
    const roteamento = useRouter();
    const user = roteamento.query.username;    
    function handleDelete(id) {
        const deleteMsg = props.mensagens.filter((msg) => msg.id !== id);
        props.setListaDeMensagem(deleteMsg);
    }


    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
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
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text 
                                tag="strong"
                                styleSheet={{
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
                            {user === `jf4c`
                            ?(
                                <Button
                                    styleSheet={{
                                        backgroundColor: appConfig.theme.colors.neutrals["700"], 
                                        marginLeft:'auto',
                                        marginBottom:'auto',
                                        borderRadius: '100%',
                                        Width: '5px',
                                        Height: '25px',
                                        
                                    }}
                                    
                                    iconName=""
                                    label="x"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDelete(mensagem.id);
                                        deletaMensagemSupabase(mensagem.id);
                                    }} 
                                />

                            )
                            :(
                                <Button
                                    styleSheet={{
                                        backgroundColor: appConfig.theme.colors.neutrals["700"], 
                                        marginLeft:'auto',
                                        marginBottom:'auto',
                                        borderRadius: '100%',
                                        Width: '5px',
                                        Height: '25px',
                                        
                                    }}
                                    disabled
                                    iconName=""
                                    label="x"
                                />
                            )}
                        
                        </Box>
                        {mensagem.texto.startsWith(':sticker:') 
                            ?(
                                <Image src={mensagem.texto.replace(':sticker:', '')}/>
                            )
                            :(
                                mensagem.texto
                            )}
                    </Text>

                );
            })}

        </Box>
    )
}