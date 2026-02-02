import { Box, Grid, Stack, Typography,Divider, Button  } from "@mui/material";
import React, { useContext } from "react";
import SideBar from "../components/SideBar";
import HeaderChatBot from "../components/ChatBot/HeaderChatbot";
import BoxMoto from "../components/CadastroMoto/BoxMoto";
import { MotoContext } from "../context/MotoContext";
import BarraPesquisa from "../components/CadastroMoto/BarraPesquisa";

const ListagemMotos = () => {
		const { cadastrarMoto, loading, erro, motos, excluirMoto, atualizarMoto, listarMotos} = useContext(MotoContext);
		const [input, setInput] = React.useState('');

		const ordernar = [
			{ label: 'Marca A-Z' },
			{ label: 'Marca Z-A' },
		];

		const handleOrdernar = (label) => {
			ordernar.map((option) => {
				<Button key={option.label} onClick={() => console.log(option.label)}> {option.label} </Button>
			});

			if (label === 'Marca A-Z') {
				const motosOrdenadas = [...motos].sort((a, b) => a.marca.localeCompare(b.marca));
				console.log(motosOrdenadas);
			} else if (label === 'Marca Z-A') {
				const motosOrdenadas = [...motos].sort((a, b) => b.marca.localeCompare(a.marca));
				console.log(motosOrdenadas);
			}
		}	
		
    return (
        <Box sx={{ display: 'flex', height: '100vh', bgcolor: "#989898", p: '16px', boxSizing: 'border-box' }}>
          <SideBar />

					<Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, ml: '20px', height: '100%' }}>
						<Stack spacing="8px" sx={{ height: '100%' }}>

							<Box sx={{ flexShrink: 0 }}>
								<HeaderChatBot />
							</Box>

							{/* Conteúdo da página de listagem de motos */}
							<Box sx={{ flexGrow: 1, bgcolor: "white", borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, overflow: 'hidden' }}>
													
							<Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', width: '100%' }}>
								<Typography mb={2} fontSize={30}> Motos </Typography>
								<Divider sx={{ width: '90%', bgcolor: 'grey.700', height: '0.4px'}} />

                <Button onClick={handleOrdernar} justifyContent='left' color="black"> Ordernar </Button>
								<BarraPesquisa input={input} setInput={setInput} />
							</Box>
								

								<Grid container spacing={2} sx={{ mt: 2 }}>
									{motos.map((moto, index) => (
										<Grid item key={index}>
											<BoxMoto nomeMoto={moto.modelo} numeroDeSerie={moto.marca} />
										</Grid>
								))}
								</Grid>
							</Box>

						</Stack>
						
					</Box>
					
  			</Box>
    );
}

export default ListagemMotos;