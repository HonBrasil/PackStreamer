# Catálogo Packs Streamer — OBS + 1 modelo / OBS + 1 modelo + 1 pack de alertas

**Projeto estático para Vercel**, com 28 imagens de prévia reais com marca-d'água. Nenhum MP4/WEBM de entrega está neste projeto.

## Preços finais (somente com contratação da configuração OBS)

- **Pack Basic — R$ 69,90** no total: configuração OBS R$ 50,00 + adicional R$ 19,90. Cliente escolhe **1 modelo** do catálogo; instalação do modelo no OBS; recebe apenas o pack escolhido, **sem alertas**.
- **Pack Completo — R$ 89,90** no total: configuração OBS R$ 50,00 + adicional R$ 39,90. Cliente escolhe **1 modelo** do catálogo e **1 pack de alertas premium** (um estilo com 11 alertas); instalação de ambos no OBS; recebe apenas esses dois conjuntos. **Não recebe a biblioteca inteira.**

É possível escolher um pack com somente facecam ou outro item isolado; confira os detalhes do cartão antes de confirmar o pedido.

## WhatsApp

O número **+55 (62) 99868-9137** está configurado em `config.js` como `5562998689137`. A solicitação pelo site abre um pedido pelo WhatsApp contendo as escolhas e o valor total.

No Completo, o sistema **exige duas seleções distintas**: modelo e pack de alertas. Clicar na prévia de um alerta pré-seleciona somente esse alerta. A confirmação exige escolher também o modelo.

## Publicação Vercel

1. Extraia o ZIP e envie **os arquivos** à raiz de um repositório GitHub.
2. Importe no Vercel como projeto **Other / Static**, sem comando de build.
3. Publicação; as imagens `previews/*.jpg` já estão incluídas.

O site usa HTML, CSS e JS puro, sem backend. Edite `config.js` para preços e telefone; se alterar valores, atualize também os totais expostos no `index.html`.

Nenhum site impede totalmente screenshots. Certifique-se de que a licença comercial dos arquivos originais permite redistribuição e venda.
