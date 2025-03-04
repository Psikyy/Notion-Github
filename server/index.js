const express = require('express');
const bodyParser = require('body-parser');
const { Client: NotionClient } = require('@notionhq/client');
require('dotenv').config({ path: './token.env' });

const app = express();
const port = 5000;

// Middleware pour parser le JSON
app.use(bodyParser.json());

// Configuration de l'API Notion
const notion = new NotionClient({ auth: process.env.NOTION_TOKEN });

// Route pour ajouter un article
app.post('/add-item', async (req, res) => {
  const { article, etat, prixVente, prixInitial, statut, quantity, imageUrl } = req.body;

  try {
    const properties = {
      'Article': {
        title: [
          {
            text: {
              content: article,
            },
          },
        ],
      },
      'Grade': {
        status: {
          name: etat,
        },
      },
      'Prix de vente': {
        number: prixVente,
      },
      'Date d\'achat': {
        date: {
          start: new Date().toISOString().split('T')[0],
        },
      },
      'Statut': {
        status: {
          name: statut,
        },
      },
      'Prix initial': {
        number: prixInitial,
      },
    };

    if (imageUrl) {
      properties['Image'] = {
        files: [
          {
            name: article,
            external: {
              url: imageUrl,
            },
          },
        ],
      };
    }

    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID,
      },
      properties: properties,
    });

    res.status(200).json({ success: true, message: 'Article ajouté avec succès!', data: response });
  } catch (error) {
    console.error('Erreur lors de l\'ajout à Notion:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'ajout à Notion', error: error.message });
  }
});

// Route pour modifier un article
app.put('/edit-item/:id', async (req, res) => {
  const { id } = req.params;
  const { article, etat, prixVente, prixInitial, statut, imageUrl } = req.body;

  try {
    const properties = {};

    if (article) {
      properties['Article'] = {
        title: [
          {
            text: {
              content: article,
            },
          },
        ],
      };
    }

    if (etat) {
      properties['Grade'] = {
        status: {
          name: etat,
        },
      };
    }

    if (prixVente) {
      properties['Prix de vente'] = {
        number: prixVente,
      };
    }

    if (prixInitial) {
      properties['Prix initial'] = {
        number: prixInitial,
      };
    }

    if (statut) {
      properties['Statut'] = {
        status: {
          name: statut,
        },
      };
    }

    if (imageUrl) {
      properties['Image'] = {
        files: [
          {
            name: article || 'Image',
            external: {
              url: imageUrl,
            },
          },
        ],
      };
    }

    const response = await notion.pages.update({
      page_id: id,
      properties: properties,
    });

    res.status(200).json({ success: true, message: 'Article modifié avec succès!', data: response });
  } catch (error) {
    console.error('Erreur lors de la modification de l\'article:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la modification de l\'article', error: error.message });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`API en cours d'exécution sur http://localhost:${port}`);
});