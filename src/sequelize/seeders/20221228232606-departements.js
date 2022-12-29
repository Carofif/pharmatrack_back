'use strict';
const { Departements, Arrondissement, Commune } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const { Op } = Sequelize;
    const data = [
      {
        nom: 'Dakar',
        arrondissements: [
          {
            nom: 'Almadies',
            communes: [
              { nom: 'Mermoz-Sacré-Cœur', quartiers: "Sacré-Cœur 1, Sacré-Cœur 2, Sacré-Cœur 3, Sacré-Cœur 3 VDN Extension, Cité Keur Gorgui, Mermoz Comico, Sicap Karak, Sicap Baobab" },
              { nom: 'Ngor', quartiers: 'Ngor' },
              { nom: 'Ouakam', quartiers: 'Ouakam' },
              { nom: 'Yoff', quartiers: 'Yoff Ngaparou, Ndeungangne, Ndenatte, Dagoudane, Mbenguenne, Tonghor, Yoff Tonghor, Djily Mbaye, Yoff BCEAO, Yoff Diamalaye, Nord Foire, Ouest Foire' },
            ],
          },
          {
            nom: 'Dakar Plateau',
            communes: [
              { nom: 'Dakar-Plateau', quartiers: 'Sancaba, Yaq Jëf, Jékko, Guy Salan, Fann Hokk, Mbakk Dënn, Kaay Usmaan Jéen, Cëriñ, Kaay Findiw, NGaaraaf, Mbott' },
              { nom: 'Fann-Point E-Amitié', quartiers: 'Amitié 1, Amitié 2, Zone B, Point E, Fann, Fann Résidence, Fann Hock, Fann Mermoz' },
              { nom: 'Gueule Tapée-Fass-Colobane', quartiers: 'Gueule Tapée, Fass Delorme, HLM Fass, Colobane' },
              { nom: 'Médina', quartiers: 'Aurevoir, Gouye Mariama Layène, Ngaraff, Santhiaba, Kaye Ousmane Diène, Gouye Salane, Diecko, Mbakeunde, Thiedème, Thierigne, Abattoirs, Gibraltar' },
            ],
          },
          {
            nom: 'Grand Dakar',
            communes: [
              { nom: 'Biscuiterie', quartiers: 'Bopp, Cité Bissap, Ouagou Niayes 1, Usine Bène Tally, Usine Niary Tally' },
              { nom: 'Dieuppeul-Derklé', quartiers: 'Dieuppeul-Derklé' },
              { nom: 'Grand Dakar', quartiers: 'Niary Tally, Zone A, Sicap Darabis, Sicap Annexe Amitié III, Taïba, Cerf Volant' },
              { nom: 'Hann Bel-Air', quartiers: 'Hann Bel-Air' },
              { nom: 'HLM', quartiers: 'HLM 1, HLM 2, HLM 3, HLM 4, HLM 5, HLM 6, Cité Port, Cité Douane, HLM Nimzatt, HLM Montagne, SONEPI, SODIDA' },
              { nom: 'Sicap-Liberté', quartiers: 'Liberté 1, Liberté 2, Liberté 3, Liberté 4, Liberté 5, Liberté 6' },
            ],
          },
          {
            nom: 'Parcelles Assainies',
            communes: [
              { nom: 'Cambérène', quartiers: 'Cambérène' },
              { nom: 'Grand Yoff', quartiers: 'Scat Urbam, zone de captage, route des Niayes' },
              { nom: 'Parcelles Assainies', quartiers: 'Unité 17, Unité 24, Unité 7, Unité 13, Unité 21' },
              { nom: 'Patte d\'Oie', quartiers: 'ité Keur Damel, cité Keur Gorgui, cité Mixta, Résidence de la Paix, Village Grand Médine, cité de la Patte d\'Oie, cité des Impôts et de Domaines, Patte d\'oie Builders, cité Al Amal, cité Bceao, cité Soprim, cité Soprim-Extension' },
            ],
          },
        ]
      },
      { nom: 'Pikine' },
      { nom: 'Rufisque' },
      { nom: 'Guédiawaye' },
      { nom: 'Keur Massar' },
      { nom: 'Bignona' },
      { nom: 'Oussouye' },
      { nom: 'Ziguinchor' },
      { nom: 'Bambey' },
      { nom: 'Diourbel' },
      { nom: 'Mbacké' },
      { nom: 'Dagana' },
      { nom: 'Podor' },
      { nom: 'Saint-Louis' },
      { nom: 'Bakel' },
      { nom: 'Tambacounda' },
      { nom: 'Goudiry' },
      { nom: 'Koumpentoum' },
      { nom: 'Kaolack' },
      { nom: 'Nioro du Rip' },
      { nom: 'Guinguinéo' },
      { nom: 'M\'bour' },
      { nom: 'Thiès' },
      { nom: 'Tivaouane' },
      { nom: 'Kébémer' },
      { nom: 'Linguère' },
      { nom: 'Louga' },
      { nom: 'Fatick' },
      { nom: 'Foundiougne' },
      { nom: 'Gossas' },
      { nom: 'Kolda' },
      { nom: 'Vélingara' },
      { nom: 'Médina Yoro Foulah' },
      { nom: 'Kanel' },
      { nom: 'Matam' },
      { nom: 'Ranérou' },
      { nom: 'Kaffrine' },
      { nom: 'Birkelane' },
      { nom: 'Koungheul' },
      { nom: 'Malem-Hodar' },
      { nom: 'Kédougou' },
      { nom: 'Salemata' },
      { nom: 'Saraya' },
      { nom: 'Sédhiou' },
      { nom: 'Bounkiling' },
      { nom: 'Goudomp' },
    ];
    const departements = data.map(d => ({
      nom: d.nom,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('Departements', departements, {});

    const deps = await Departements.findAll({
      where: { [Op.or]: departements.map(d => ({ nom: d.nom })) }
    });
    const arrondissements = data.map(d => d?.arrondissements?.map(a => ({
      nom: a.nom,
      departementId: deps.find(el => el.dataValues.nom === d.nom).dataValues.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })) || []).flat();
    await queryInterface.bulkInsert('Arrondissements', arrondissements, {});

    const arrs = await Arrondissement.findAll({
      where: { [Op.or]: arrondissements.map(el => ({ nom: el.nom })) }
    });
    const communes = data.map(d => d?.arrondissements?.map(arr => arr?.communes?.map(c => ({
      nom: c.nom,
      arrondissementId: arrs.find(el => el.dataValues.nom === arr.nom).dataValues.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })) || []).flat() || []).flat();
    await queryInterface.bulkInsert('Communes', communes, {});

    const comms = await Commune.findAll({
      where: { [Op.or]: communes.map(el => ({ nom: el.nom })) }
    });
    const quartiers = data.map(d => d?.arrondissements?.map(arr => arr?.communes?.map(c => c?.quartiers?.split(', ').map(q => ({
      nom: q,
      communeId: comms.find(el => el.dataValues.nom === c.nom).dataValues.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })) || []).flat() || []).flat() || []).flat();
    await queryInterface.bulkInsert('Quartiers', quartiers, {});
  },

  async down (queryInterface/* , Sequelize */) {
    await queryInterface.bulkDelete('Departements', null, {});
    await queryInterface.bulkDelete('Arrondissements', null, {});
    await queryInterface.bulkDelete('Communes', null, {});
    await queryInterface.bulkDelete('Quartiers', null, {});
    return;
  }
};
