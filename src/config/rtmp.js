import NodeMediaServer from 'node-media-server';
import knex from 'knex';
import knexConfig from '../../knexfile.js';

const db = knex(knexConfig.development);

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*'
  }
};

const nms = new NodeMediaServer(config);

// Validate stream key when someone tries to publish
nms.on('prePublish', async (id, StreamPath, args) => {
  console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  
  // Extract stream key from path (e.g., /live/streamkey)
  const streamKey = StreamPath.split('/')[2];
  
  try {
    // Validate stream key against database
    const livestream = await db("livestreams")
      .where({ stream_key: streamKey, is_live: true })
      .first();
      
    if (!livestream) {
      console.log('Invalid stream key:', streamKey);
      // Reject the stream
      const session = nms.getSession(id);
      session.reject();
      return;
    }
    
    console.log('Stream key validated:', streamKey);
    
    // Log stream started event
    await db("livestream_events").insert({
      livestream_id: livestream.id,
      user_id: livestream.created_by,
      event_type: "stream_connected",
      metadata: { stream_key: streamKey }
    });

    await db("audit_logs").insert({
      entity_type: 'stream',
      action: 'started',
      user_id: livestream.created_by,
      created_at: db.fn.now(),
    });
    
  } catch (error) {
    console.error('Error validating stream key:', error);
    const session = nms.getSession(id);
    session.reject();
  }
});

// When stream ends
nms.on('donePublish', async (id, StreamPath, args) => {
  console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath}`);
  
  const streamKey = StreamPath.split('/')[2];
  
  try {
    const livestream = await db("livestreams")
      .where({ stream_key: streamKey })
      .first();
      
    if (livestream) {
      // Update livestream status
      await db("livestreams")
        .where({ stream_key: streamKey })
        .update({ is_live: false, ended_at: db.fn.now() });
        
      // Log stream ended event
      await db("livestream_events").insert({
        livestream_id: livestream.id,
        user_id: livestream.created_by,
        event_type: "stream_disconnected",
        metadata: { stream_key: streamKey }
      });

      await db("audit_logs").insert({
        entity_type: 'stream',
        action: 'ended',
        user_id: livestream.created_by,
        created_at: db.fn.now(),
      });
    }
  } catch (error) {
    console.error('Error handling stream end:', error);
  }
});

export default nms;