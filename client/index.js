const { Client, GatewayIntentBits, REST, Routes, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
require('dotenv').config({ path: './token.env' });

// Configuration des variables d'environnement
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const API_URL = process.env.API_URL || 'http://localhost:5000';

// Initialisation du client REST de Discord
const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

// Configuration du client Discord
const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const commands = [
  {
    name: 'add',
    description: 'Ajouter un vêtement à la base de données de ventes',
  },
  {
    name: 'edit',
    description: 'Modifier un article dans la base de données de ventes',
    options: [
      {
        name: 'id',
        description: 'ID de l\'article à modifier',
        type: 3, // Type STRING
        required: true,
      },
    ],
  },
];

async function registerCommands() {
  try {
    console.log('Suppression des anciennes commandes...');
    
    // Supprimer toutes les commandes existantes
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: [] }
    );
    
    console.log('Enregistrement des nouvelles commandes slash...');
    
    // Enregistrer les nouvelles commandes
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    
    console.log('Commandes slash enregistrées avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des commandes:', error);
  }
}

// Événements Discord
discordClient.once('ready', () => {
  console.log(`Bot connecté en tant que ${discordClient.user.tag}`);
  registerCommands();
});

// Gestionnaire d'événements interactionCreate
discordClient.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    if (interaction.commandName === 'add') {
      // Créer une fenêtre modale pour ajouter un article
      const modal = new ModalBuilder()
        .setCustomId('addItemModal')
        .setTitle('Ajouter un article');

      // Champ pour le nom de l'article
      const articleInput = new TextInputBuilder()
        .setCustomId('articleInput')
        .setLabel('Nom de l\'article')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      // Champ pour l'état de l'article
      const etatInput = new TextInputBuilder()
        .setCustomId('etatInput')
        .setLabel('État (Neuf, Très bon, Bon, Mauvais)')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      // Champ pour le statut
      const statutInput = new TextInputBuilder()
        .setCustomId('statutInput')
        .setLabel('Statut (Reçu, Posté, En cours, etc.)')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      // Champ pour le prix de vente
      const prixVenteInput = new TextInputBuilder()
        .setCustomId('prixVenteInput')
        .setLabel('Prix de vente')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      // Champ pour le prix initial
      const prixInitialInput = new TextInputBuilder()
        .setCustomId('prixInitialInput')
        .setLabel('Prix initial')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      // Champ pour l'URL de l'image
      const imageUrlInput = new TextInputBuilder()
        .setCustomId('imageUrlInput')
        .setLabel('URL de l\'image')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      // Ajouter les champs à la fenêtre modale
      const firstActionRow = new ActionRowBuilder().addComponents(articleInput);
      const secondActionRow = new ActionRowBuilder().addComponents(etatInput);
      const thirdActionRow = new ActionRowBuilder().addComponents(statutInput);
      const fourthActionRow = new ActionRowBuilder().addComponents(prixVenteInput);
      const fifthActionRow = new ActionRowBuilder().addComponents(prixInitialInput);
      const sixthActionRow = new ActionRowBuilder().addComponents(imageUrlInput);

      modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow, sixthActionRow);

      // Afficher la fenêtre modale
      await interaction.showModal(modal);
    } else if (interaction.commandName === 'edit') {
      const id = interaction.options.getString('id');

      // Créer une fenêtre modale pour modifier un article
      const modal = new ModalBuilder()
        .setCustomId('editItemModal')
        .setTitle('Modifier un article');

      // Champ pour le nom de l'article
      const articleInput = new TextInputBuilder()
        .setCustomId('articleInput')
        .setLabel('Nouveau nom de l\'article')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      // Champ pour l'état de l'article
      const etatInput = new TextInputBuilder()
        .setCustomId('etatInput')
        .setLabel('Nouvel état (Neuf, Très bon, Bon, Mauvais)')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      // Champ pour le statut
      const statutInput = new TextInputBuilder()
        .setCustomId('statutInput')
        .setLabel('Nouveau statut (Reçu, Posté, En cours, etc.)')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      // Champ pour le prix de vente
      const prixVenteInput = new TextInputBuilder()
        .setCustomId('prixVenteInput')
        .setLabel('Nouveau prix de vente')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      // Champ pour le prix initial
      const prixInitialInput = new TextInputBuilder()
        .setCustomId('prixInitialInput')
        .setLabel('Nouveau prix initial')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      // Champ pour l'URL de l'image
      const imageUrlInput = new TextInputBuilder()
        .setCustomId('imageUrlInput')
        .setLabel('Nouvelle URL de l\'image')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      // Ajouter les champs à la fenêtre modale
      const firstActionRow = new ActionRowBuilder().addComponents(articleInput);
      const secondActionRow = new ActionRowBuilder().addComponents(etatInput);
      const thirdActionRow = new ActionRowBuilder().addComponents(statutInput);
      const fourthActionRow = new ActionRowBuilder().addComponents(prixVenteInput);
      const fifthActionRow = new ActionRowBuilder().addComponents(prixInitialInput);
      const sixthActionRow = new ActionRowBuilder().addComponents(imageUrlInput);

      modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow, sixthActionRow);

      // Afficher la fenêtre modale
      await interaction.showModal(modal);

      // Stocker l'ID de l'article à modifier dans l'interaction
      interaction.articleId = id;
    }
  } else if (interaction.isModalSubmit()) {
    if (interaction.customId === 'addItemModal') {
      await interaction.deferReply({ ephemeral: true });

      try {
        // Récupérer les valeurs saisies dans la fenêtre modale
        const article = interaction.fields.getTextInputValue('articleInput');
        const etat = interaction.fields.getTextInputValue('etatInput');
        const statut = interaction.fields.getTextInputValue('statutInput');
        const prixVente = interaction.fields.getTextInputValue('prixVenteInput');
        const prixInitial = interaction.fields.getTextInputValue('prixInitialInput');
        const imageUrl = interaction.fields.getTextInputValue('imageUrlInput');

        // Envoyer les données à l'API
        const response = await fetch(`${API_URL}/add-item`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            article,
            etat,
            prixVente: prixVente ? parseFloat(prixVente) : null,
            prixInitial: prixInitial ? parseFloat(prixInitial) : null,
            statut,
            quantity: 1,
            imageUrl,
          }),
        });

        const data = await response.json();

        if (data.success) {
          await interaction.editReply({
            content: `✅ Article "${article}" ajouté avec succès!`,
            ephemeral: true,
          });
        } else {
          await interaction.editReply({
            content: `❌ Erreur lors de l'ajout de l'article: ${data.message}`,
            ephemeral: true,
          });
        }
      } catch (error) {
        await interaction.editReply({
          content: `❌ Erreur lors de l'ajout de l'article: ${error.message}`,
          ephemeral: true,
        });
      }
    } else if (interaction.customId === 'editItemModal') {
      await interaction.deferReply({ ephemeral: true });

      try {
        // Récupérer les valeurs saisies dans la fenêtre modale
        const article = interaction.fields.getTextInputValue('articleInput');
        const etat = interaction.fields.getTextInputValue('etatInput');
        const statut = interaction.fields.getTextInputValue('statutInput');
        const prixVente = interaction.fields.getTextInputValue('prixVenteInput');
        const prixInitial = interaction.fields.getTextInputValue('prixInitialInput');
        const imageUrl = interaction.fields.getTextInputValue('imageUrlInput');

        // Envoyer les données à l'API
        const response = await fetch(`${API_URL}/edit-item/${interaction.articleId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            article,
            etat,
            prixVente: prixVente ? parseFloat(prixVente) : null,
            prixInitial: prixInitial ? parseFloat(prixInitial) : null,
            statut,
            imageUrl,
          }),
        });

        const data = await response.json();

        if (data.success) {
          await interaction.editReply({
            content: `✅ Article modifié avec succès!`,
            ephemeral: true,
          });
        } else {
          await interaction.editReply({
            content: `❌ Erreur lors de la modification de l'article: ${data.message}`,
            ephemeral: true,
          });
        }
      } catch (error) {
        await interaction.editReply({
          content: `❌ Erreur lors de la modification de l'article: ${error.message}`,
          ephemeral: true,
        });
      }
    }
  }
});

// Connexion du bot Discord
discordClient.login(DISCORD_TOKEN);