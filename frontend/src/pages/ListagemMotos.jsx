import { Box, Grid, Stack, Typography, Divider, Button, Menu, MenuItem } from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import HeaderChatBot from "../components/ChatBot/HeaderChatbot";
import BoxMoto from "../components/CadastroMoto/BoxMoto";
import { MotoContext } from "../context/MotoContext";

import BarraPesquisa from "../components/CadastroMoto/BarraPesquisa";

const ListagemMotos = () => {
  const { listarMotos, motos } = useContext(MotoContext);

  const [input, setInput] = React.useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const [tipoOrdenacao, setTipoOrdenacao] = useState(null);

  useEffect(() => {
    listarMotos();
  }, []);

  const handleClickOrdernar = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectOrder = (tipo) => {
    setTipoOrdenacao(tipo);
    handleCloseMenu();
  };

  const motosProcessadas = React.useMemo(() => {
    let lista = [...motos];
    if (input) {
      lista = lista.filter((moto) =>
        moto.modelo?.toLowerCase().includes(input.toLowerCase()) ||
        moto.marca?.toLowerCase().includes(input.toLowerCase())
      );
    }
    if (tipoOrdenacao === 'AZ') {
      lista.sort((a, b) => a.modelo.localeCompare(b.modelo));
    } else if (tipoOrdenacao === 'ZA') {
      lista.sort((a, b) => b.modelo.localeCompare(a.modelo));
    }
    return lista;
  }, [motos, input, tipoOrdenacao]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: "#989898",
        p: "16px",
        boxSizing: "border-box",
      }}
    >
      <SideBar />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          ml: "20px",
          height: "100%",
        }}
      >
        <Stack spacing="8px" sx={{ height: "100%" }}>
          <Box sx={{ flexShrink: 0 }}>
            <HeaderChatBot />
          </Box>

          {/* Conteúdo da página de listagem de motos */}
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: "white",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 4,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflowY: "auto",
                width: "100%",
              }}
            >
              <Typography mb={2} fontSize={30}>
                Motos
              </Typography>
              <Divider
                sx={{ width: "90%", bgcolor: "grey.700", height: "0.4px" }}
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "90%",
                  position: "relative",
                  mt: 2,
                }}
              >
                <Typography
                  onClick={handleClickOrdernar}
                  color="black"
                  sx={{ position: "absolute", left: 0 }}
                >
                  Ordernar
                </Typography>

                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleCloseMenu}
                >
                  <MenuItem onClick={() => handleSelectOrder("AZ")}>
                    Marca A-Z
                  </MenuItem>
                  <MenuItem onClick={() => handleSelectOrder("ZA")}>
                    Marca Z-A
                  </MenuItem>
                </Menu>

                <BarraPesquisa input={input} setInput={setInput} />
              </Box>
            </Box>

            {/*Box das motos com fundo cinza ao redor delas*/}
            <Box
              backgroundColor="#DBDBDB"
              sx={{
                flexGrow: 8,
                width: "90%",
                borderRadius: "16px",
                p: 2,
                mt: 2,
                overflowY: "auto",
              }}
            >
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {motosProcessadas.length > 0 ? (
                  motosProcessadas.map((moto, index) => (
                    <Grid item key={moto.id || index}>
                      <BoxMoto
                        nomeMoto={moto.modelo}
                        numeroDeSerie={moto.marca}
                        estado={moto.estado}
                      />
                    </Grid>
                  ))
                ) : (
                  <Typography sx={{ p: 2 }}>
                    Nenhuma moto encontrada.
                  </Typography>
                )}
              </Grid>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default ListagemMotos;
