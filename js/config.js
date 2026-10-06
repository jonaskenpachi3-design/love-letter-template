/* ==========================================================
   CONFIGURAÇÃO DO SITE
   Edite apenas este arquivo para personalizar o site com o
   nome, a data e as fotos da pessoa especial. Nenhum outro
   arquivo precisa ser alterado para uma customização básica.
========================================================== */

const SITE_CONFIG = {

    /* Nome que aparece na intro, no topo, no player de música,
       na seção final e formado pelas estrelas no céu */
    name: "Alguém Especial",

    /* Data de início do relacionamento (ou de qualquer marco
       que você queira contar), no formato AAAA-MM-DDTHH:MM:SS */
    sinceDate: "2024-01-01T00:00:00",

    /* Fotos da galeria. Adicione, remova ou edite quantos
       itens quiser — os cards são gerados automaticamente
       a partir desta lista. As imagens ficam em assets/images/ */
    photos: [
        {
            src: "assets/images/photo1.jpg",
            alt: "Um momento especial",
            title: "Um momento especial",
            caption: "Cada detalhe vale a pena lembrar."
        },
        {
            src: "assets/images/photo2.jpg",
            alt: "Um momento especial",
            title: "Um momento único",
            caption: "Porque algumas pessoas mudam o céu inteiro."
        }
    ],

    /* Arquivo de música de fundo (opcional). Coloque o arquivo
       em assets/music/ e ajuste o caminho abaixo. Se não houver
       música, o botão de play fica desabilitado automaticamente */
    musicFile: "assets/music/musica.mp3"

};
