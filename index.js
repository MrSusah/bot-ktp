require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Events
} = require("discord.js");

const { createCanvas, loadImage, registerFont } = require("canvas");

// ================= FONT =================
registerFont("./font-ktp.ttf", { family: "KTPFont" });

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ================= READY =================
client.once("clientReady", () => {
  console.log(`Login sebagai ${client.user.tag}`);
});

// ================= INTERACTION =================
client.on(Events.InteractionCreate, async (interaction) => {

  // ================= BUTTON =================
  if (interaction.isButton() && interaction.customId === "buat_ktp") {

    const modal = new ModalBuilder()
      .setCustomId("form_ktp")
      .setTitle("Isi Data KTP Kamu");

    const nama = new TextInputBuilder()
      .setCustomId("nama")
      .setLabel("Nama Lengkap")
      .setStyle(TextInputStyle.Short);

    const gender = new TextInputBuilder()
      .setCustomId("gender")
      .setLabel("Jenis Kelamin")
      .setStyle(TextInputStyle.Short);

    const domisili = new TextInputBuilder()
      .setCustomId("domisili")
      .setLabel("Domisili")
      .setStyle(TextInputStyle.Short);

    const agama = new TextInputBuilder()
      .setCustomId("agama")
      .setLabel("Agama")
      .setStyle(TextInputStyle.Short);

    const hobi = new TextInputBuilder()
      .setCustomId("hobi")
      .setLabel("Hobi")
      .setStyle(TextInputStyle.Short);

    modal.addComponents(
      new ActionRowBuilder().addComponents(nama),
      new ActionRowBuilder().addComponents(gender),
      new ActionRowBuilder().addComponents(domisili),
      new ActionRowBuilder().addComponents(agama),
      new ActionRowBuilder().addComponents(hobi)
    );

    return interaction.showModal(modal);
  }

  // ================= SUBMIT =================
  if (interaction.isModalSubmit() && interaction.customId === "form_ktp") {

    const nama = interaction.fields.getTextInputValue("nama");
    const gender = interaction.fields.getTextInputValue("gender");
    const domisili = interaction.fields.getTextInputValue("domisili");
    const agama = interaction.fields.getTextInputValue("agama");
    const hobi = interaction.fields.getTextInputValue("hobi");

    const serial = "TNY-" + Math.floor(100000000 + Math.random() * 900000000);

    const canvas = createCanvas(600, 350);
    const ctx = canvas.getContext("2d");

    const bg = await loadImage("./ktp-template.png");
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    // ================= TEXT =================
    const startX = 70;
    const startY = 125;
    const gap = 27;

    const titikX = startX + 110;
    const dataX = titikX + 15;

    ctx.fillStyle = "#000000";

    ctx.font = "bold 18px KTPFont";

    ctx.fillText("No KTP", startX, startY);
    ctx.fillText("NAMA", startX, startY + gap);
    ctx.fillText("GENDER", startX, startY + gap * 2);
    ctx.fillText("DOMISILI", startX, startY + gap * 3);
    ctx.fillText("AGAMA", startX, startY + gap * 4);
    ctx.fillText("HOBI", startX, startY + gap * 5);

    ctx.fillText(":", titikX, startY);
    ctx.fillText(":", titikX, startY + gap);
    ctx.fillText(":", titikX, startY + gap * 2);
    ctx.fillText(":", titikX, startY + gap * 3);
    ctx.fillText(":", titikX, startY + gap * 4);
    ctx.fillText(":", titikX, startY + gap * 5);

    ctx.font = "16px KTPFont";

    ctx.fillText(serial, dataX, startY);
    ctx.fillText(nama, dataX, startY + gap);
    ctx.fillText(gender, dataX, startY + gap * 2);
    ctx.fillText(domisili, dataX, startY + gap * 3);
    ctx.fillText(agama, dataX, startY + gap * 4);
    ctx.fillText(hobi, dataX, startY + gap * 5);

    // ================= FOTO =================
    const avatar = await loadImage(
      interaction.user.displayAvatarURL({ extension: "png" })
    );

    const photoX = 451;
    const photoY = 170;
    const photoWidth = 86;
    const photoHeight = 118;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(photoX, photoY, photoWidth, photoHeight, 10);
    ctx.clip();
    ctx.drawImage(avatar, photoX, photoY, photoWidth, photoHeight);
    ctx.restore();

    const buffer = canvas.toBuffer("image/png");

    // ================= BUTTON DI BAWAH HASIL =================
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("buat_ktp")
        .setLabel("Buat KTP")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("🪪")
    );

    await interaction.reply({
      content: `<@${interaction.user.id}> KTP kamu berhasil dibuat!`,
      files: [{ attachment: buffer, name: "ktp.png" }],
      components: [row]
    });
  }
});

// ================= KIRIM BUTTON AWAL =================
client.once("clientReady", async () => {
  const channel = await client.channels.fetch("1493786180758540428");

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("buat_ktp")
      .setLabel("Buat KTP")
      .setStyle(ButtonStyle.Primary)
  );

  channel.send({
    content: "Klik tombol untuk membuat KTP",
    components: [row]
  });
});

client.login(process.env.TOKEN);