require('dotenv').config();
const {ApplicationCommandOptionType, EmbedBuilder, RoleSelectMenuBuilder, ActionRowBuilder, ComponentType} = require('discord.js');

/** @type {import('commandkit').CommandData} */
const data = {
    name: 'verify',
    description: 'verification',
    options: [
        {
            name: 'user',
            description: 'user to verify',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],
};

/** @param {import('commandkit').SlashCommandProps} param0 */
async function run ({interaction, client}){
  if(!interaction.isChatInputCommand()) return;
    
  const interTargetID = interaction.options.get('user').value;
  const interUser = interaction.guild.members.cache.get(interTargetID);
  const interUserAvatar = interUser.user.avatar;

  // Embeds
  const SuccessEmbed = new EmbedBuilder()
    .setTitle("Verification")
    .setImage(`https://cdn.discordapp.com/avatars/${interTargetID}/${interUserAvatar}`)
    .setDescription(`${interUser.user.displayName} has been verified!`)
    .setColor(5763719);

  const RemovedEmbed = new EmbedBuilder()
    .setTitle("Verification")
    .setDescription(`Role has been removed!`)
    .setColor(15548997);

  const ChangeEmbed = new EmbedBuilder()
    .setTitle("Verification")
    .setDescription('Role has been changed!')
    .setColor(3447003);
  
  const ErrorEmbed = new EmbedBuilder()
    .setTitle("verification")
    .setDescription('no roles selected!')
    .setColor(15548997);

  const roleMenu = new RoleSelectMenuBuilder()
    .setCustomId("interaction.id")
    .setMinValues(0)
    .setMaxValues(1);

      
    // Main
  const actionRow = new ActionRowBuilder().addComponents(roleMenu);

  const reply = await interaction.reply({ components: [actionRow] });

  const collector = reply.createMessageComponentCollector({
    ComponentType: ComponentType.RoleSelect,
    filter: (i) =>
      i.user.id === interaction.user.id && i.customId === "interaction.id",
    time: 60_000,
  });

  collector.on("collect", (interaction) => {
    if (!interaction.values.length) {
      interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
    };

    const UnverifiedRole = process.env.UNVERIFIED_ROLE_ID;
    const BoyRole = process.env.BOY_ROLE_ID;
    const GirlRole = process.env.GIRL_ROLE_ID;

    if(interUser.roles.cache.has(BoyRole) && interaction.values[0] === BoyRole) {
      interUser.roles.remove(BoyRole);
      interUser.roles.add(UnverifiedRole);
      interaction.reply({ embeds: [RemovedEmbed], ephemeral: true });
    };
    if(interUser.roles.cache.has(GirlRole) && interaction.values[0] === GirlRole) {
      interUser.roles.remove(GirlRole);
      interUser.roles.add(UnverifiedRole);
      interaction.reply({ embeds: [RemovedEmbed], ephemeral: true });
    };
    if(interUser.roles.cache.has(BoyRole) && interaction.values[0] === GirlRole) {
      interUser.roles.remove(BoyRole);
      interUser.roles.add(GirlRole);
      interaction.reply({ embeds: [ChangeEmbed], ephemeral: true });
    };
    if(interUser.roles.cache.has(GirlRole) && interaction.values[0] === BoyRole) {
      interUser.roles.remove(GirlRole);
      interUser.roles.add(BoyRole);
      interaction.reply({ embeds: [ChangeEmbed], ephemeral: true });
    };
    if(interUser.roles.cache.has(UnverifiedRole) && interaction.values[0] === BoyRole) {
      interUser.roles.remove(UnverifiedRole);
      interUser.roles.add(BoyRole);
      interaction.reply({ embeds: [SuccessEmbed] });
    };
    if(interUser.roles.cache.has(UnverifiedRole) && interaction.values[0] === GirlRole) {
      interUser.roles.remove(UnverifiedRole);
      interUser.roles.add(GirlRole);
      interaction.reply({ embeds: [SuccessEmbed], ephemeral: true });
    };
    if (!interaction.values[0] === GirlRole || !interaction.values[0] === BoyRole) {
      interaction.reply({ embeds: [ErrorEmbed], ephemeral: true })
    };
  });
};

/** @type {import('commandkit').CommandOptions} */
const options = {
    devOnly: true,
}
module.exports = {data, run, options};