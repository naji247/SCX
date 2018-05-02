import sequelize from '../data/sequelize';
import passport from '../passport';

export const getAllTransactions = (req, res) => {
  passport.authenticate('jwt', { session: false })(req, res, function() {
    const authorizedUserId = req.user.id;

    if (!req.params || !req.params.user_id) {
      res.status(400).send('No user ID provided to fetch transactions for.');
    }

    if (req.params.user_id !== authorizedUserId) {
      res.status(401).send({
        message: 'You are unauthorized to see this users transactions.',
      });
    }

    const userId = req.params.user_id;

    const sqlString = `SELECT t.created_at as "date", sender.id as "senderId", sender.first_name as "sender", recipient.id as "recipientId", recipient.first_name as "recipient", t.memo, t.amount 
    FROM transaction t
      JOIN wallet sender_wallet
        ON t.sender_address = sender_wallet.address
      JOIN wallet recipient_wallet
         ON t.recipient_address = recipient_wallet.address
      JOIN "user" sender
        ON sender.id = sender_wallet.user_id
      JOIN "user" recipient
        ON recipient.id = recipient_wallet.user_id
      WHERE sender.id = '${userId}' 
        OR recipient.id = '${userId}';`;

    sequelize
      .query(sqlString, { type: sequelize.QueryTypes.SELECT })
      .then(result => {
        res.send(negateUserTransactions(userId, result));
      })
      .catch(error => {
        res.status(500).send({
          message: 'There was a problem fetching your transactions.',
        });
      });
  });
};

function negateUserTransactions(userId, transactions) {
  return transactions.map(trans => {
    if (trans.senderId !== userId) return trans;
    return { ...trans, amount: -1 * trans.amount };
  });
}
