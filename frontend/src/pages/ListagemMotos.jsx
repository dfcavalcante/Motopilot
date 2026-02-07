import React, { useContext, useState, useEffect, useMemo } from "react";
import {
  Box,
  Grid,
  Stack,
  Typography,
  Divider,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import SideBar from "../components/SideBar";
import HeaderChatBot from "../components/ChatBot/HeaderChatbot";
import BoxMoto from "../components/CadastroMoto/BoxMoto";
import { MotoContext } from "../context/MotoContext";
import BarraPesquisa from "../components/CadastroMoto/BarraPesquisa";
import UpdateMoto from "../components/CadastroMoto/UpdateMoto";

const ListagemMotos = () => {
  const { listarMotos, motos, excluirMoto, atualizarMoto } =
    useContext(MotoContext);

  const [input, setInput] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [tipoOrdenacao, setTipoOrdenacao] = useState(null);
  const [editingMoto, setEditingMoto] = useState(null);

  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    listarMotos();
  }, []);

  const handleClickOrdernar = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleSelectOrder = (tipo) => {
    setTipoOrdenacao(tipo);
    handleCloseMenu();
  };

  const motosProcessadas = useMemo(() => {
    let lista = [...motos];
    if (input) {
      lista = lista.filter(
        (moto) =>
          moto.modelo?.toLowerCase().includes(input.toLowerCase()) ||
          moto.marca?.toLowerCase().includes(input.toLowerCase()),
      );
    }
    if (tipoOrdenacao === "AZ") {
      lista.sort((a, b) => a.modelo.localeCompare(b.modelo));
    } else if (tipoOrdenacao === "ZA") {
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

          <Box
            sx={{
              flexGrow: 1,
              bgcolor: "white",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
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
                  sx={{
                    position: "absolute",
                    left: 0,
                    cursor: "pointer",
                    fontWeight: "500",
                    color: "grey.700",
                  }}
                >
                  Ordenar
                </Typography>

                <IconButton
                  onClick={handleClickOrdernar}
                  sx={{
                    position: "absolute",
                    left: 70,
                    width: "20px", 
                    height: "20px",
                    borderRadius: "6px", 
                    border: "1px solid #E0E0E0", 
                    backgroundColor: "white",
                    padding: 0,
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                      borderColor: "#bdbdbd",
                    },
                  }}
                >
                  <img
                    src="/images/linhaPraBaixo.png"
                    alt="Ordenar"
                    style={{
                      width: "10px",
                      height: "8px",
                      display: "block",
                    }}
                  />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleCloseMenu}
                >
                  <MenuItem onClick={() => handleSelectOrder("AZ")}>
                    Modelo A-Z
                  </MenuItem>
                  <MenuItem onClick={() => handleSelectOrder("ZA")}>
                    Modelo Z-A
                  </MenuItem>
                </Menu>

                <BarraPesquisa input={input} setInput={setInput} />
              </Box>
            </Box>

            {/*Box das motos com fundo cinza ao redor delas*/}
            <Box
              backgroundColor="#DBDBDB"
              sx={{
                flexGrow: 100,
                width: "100%",
                borderRadius: "16px",
                p: 2,
                mt: 2,
                overflowY: "auto",
              }}
            >
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {motosProcessadas.length > 0 ? (
                  motosProcessadas.map((moto) => (
                    <Grid item key={moto.id} xs={12} sm={6} md={4}>
                      <BoxMoto
                        nomeMoto={moto.modelo}
                        numeroDeSerie={moto.marca} // Ou a prop correta de marca
                        ano={moto.ano}
                        onEdit={() => setEditingMoto(moto)}
                        onDelete={() => excluirMoto(moto.id)}
                      />
                    </Grid>
                  ))
                ) : (
                  <Typography sx={{ p: 2, width: "100%", textAlign: "center" }}>
                    Nenhuma moto encontrada.
                  </Typography>
                )}
              </Grid>
            </Box>
          </Box>
        </Stack>
      </Box>

      {editingMoto && (
        <UpdateMoto
          open={!!editingMoto}
          onClose={() => setEditingMoto(null)}
          onSave={async (dados) => {
            await atualizarMoto(editingMoto.id, dados);
            setEditingMoto(null);
          }}
          initialData={editingMoto}
        />
      )}
    </Box>
  );
};

export default ListagemMotos;
