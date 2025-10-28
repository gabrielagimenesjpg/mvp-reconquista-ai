const OpenAI = require('openai');

async function testOpenAIConnection() {
  console.log('🔍 Testando conexão com OpenAI...\n');
  
  // Verificar se a variável de ambiente existe
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Erro: Variável OPENAI_API_KEY não encontrada');
    console.error('💡 Adicione sua chave da OpenAI nas variáveis de ambiente');
    return;
  }
  
  console.log('✅ Variável OPENAI_API_KEY encontrada');
  console.log('🔑 Chave: ' + process.env.OPENAI_API_KEY.substring(0, 10) + '...');
  
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    console.log('📡 Fazendo request para gpt-4-turbo...');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ 
        role: 'user', 
        content: 'Retorne apenas: Conexão com a OpenAI funcionando ✅' 
      }],
      max_tokens: 20,
    });
    
    const response = completion.choices[0].message.content;
    console.log('\n🎉 Resposta da OpenAI:');
    console.log(response);
    console.log('\n✅ Teste concluído com sucesso!');
    
  } catch (error) {
    console.error('\n❌ Erro na conexão com OpenAI:');
    console.error('Tipo:', error.constructor.name);
    console.error('Mensagem:', error.message);
    
    if (error.status) {
      console.error('Status HTTP:', error.status);
    }
    
    if (error.code) {
      console.error('Código:', error.code);
    }
    
    // Sugestões baseadas no tipo de erro
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      console.error('\n💡 Sugestão: Verifique se sua chave da OpenAI está correta');
    } else if (error.message.includes('429')) {
      console.error('\n💡 Sugestão: Limite de rate excedido, tente novamente em alguns minutos');
    } else if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
      console.error('\n💡 Sugestão: Verifique sua conexão com a internet');
    }
  }
}

// Executar o teste
testOpenAIConnection();