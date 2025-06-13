// VARIÁVEIS GLOBAIS
let alimentosGerados = 0;
let tecnologiaEnviada = 0;

let campoX, campoY, campoLargura, campoAltura;
let cidadeX, cidadeY, cidadeLargura, cidadeAltura;

let alimentos = []; // Array para armazenar os objetos Alimento
let tecnologias = []; // Array para armazenar os objetos Tecnologia

// CLASSE ALIMENTO
class Alimento {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20; // Tamanho inicial do alimento
    this.targetX = width / 2 + random(50, width / 2 - 50); // Ponto de destino na cidade
    this.targetY = random(50, height - 50); // Ponto de destino aleatório na cidade
    this.speed = 3; // Velocidade de movimento
    this.isMoving = false; // Indica se o alimento está se movendo para a cidade
    this.consumed = false; // Indica se o alimento foi consumido
    this.color = color(random(100, 200), random(150, 255), random(50, 100)); // Cores de frutas/vegetais
  }

  display() {
    if (!this.consumed) {
      fill(this.color);
      noStroke();
      ellipse(this.x, this.y, this.size, this.size); // Desenha o alimento como um círculo
    }
  }

  move() {
    if (this.isMoving && !this.consumed) {
      let dx = this.targetX - this.x;
      let dy = this.targetY - this.y;
      let distance = dist(this.x, this.y, this.targetX, this.targetY);

      if (distance > this.speed) {
        this.x += dx / distance * this.speed;
        this.y += dy / distance * this.speed;
      } else {
        this.consumed = true; // Chegou ao destino, foi "consumido"
      }
    }
  }

  isHovered(mouseX, mouseY) {
    let d = dist(mouseX, mouseY, this.x, this.y);
    return d < this.size / 2;
  }

  startMoving() {
    this.isMoving = true;
  }
}

// CLASSE TECNOLOGIA
class Tecnologia {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 25; // Tamanho da tecnologia
    this.targetX = random(50, campoLargura - 50); // Ponto de destino no campo
    this.targetY = random(50, height - 50); // Ponto de destino aleatório no campo
    this.speed = 3; // Velocidade de movimento
    this.isMoving = false;
    this.arrived = false; // Indica se chegou ao campo
    this.color = color(50, 100, 200); // Azul para tecnologia (ex: engrenagem, chip)
  }

  display() {
    if (!this.arrived) {
      fill(this.color);
      noStroke();
      rectMode(CENTER); // Desenha o retângulo a partir do centro
      rect(this.x, this.y, this.size, this.size);
      rectMode(CORNER); // Volta para o modo padrão
      
      // Opcional: Desenhar um pequeno detalhe para parecer uma engrenagem
      // fill(200);
      // ellipse(this.x, this.y, this.size * 0.4, this.size * 0.4);
    }
  }

  move() {
    if (this.isMoving && !this.arrived) {
      let dx = this.targetX - this.x;
      let dy = this.targetY - this.y;
      let distance = dist(this.x, this.y, this.targetX, this.y); // Move mais horizontalmente
      
      // Para fazer a tecnologia "ir" para o campo
      if (this.x > this.targetX + this.speed) { // Se ainda não chegou no X do alvo
        this.x -= this.speed; // Movimenta para a esquerda
      } else if (this.x < this.targetX - this.speed) {
        this.x += this.speed;
      } else {
        // Chegou perto do X do alvo, agora ajusta o Y
        if (this.y > this.targetY + this.speed) {
            this.y -= this.speed;
        } else if (this.y < this.targetY - this.speed) {
            this.y += this.speed;
        } else {
            this.arrived = true;
        }
      }
    }
  }

  isHovered(mouseX, mouseY) {
    return mouseX > this.x - this.size / 2 && mouseX < this.x + this.size / 2 &&
           mouseY > this.y - this.size / 2 && mouseY < this.y + this.size / 2;
  }

  startMoving() {
    this.isMoving = true;
  }
}

function setup() {
  createCanvas(800, 600);
  
  campoX = 0;
  campoY = 0;
  campoLargura = width / 2;
  campoAltura = height;
  
  cidadeX = width / 2;
  cidadeY = 0;
  cidadeLargura = width / 2;
  cidadeAltura = height;

  // Gera alguns alimentos iniciais no campo
  for (let i = 0; i < 5; i++) {
    alimentos.push(new Alimento(random(50, campoLargura - 50), random(50, height - 50)));
  }

  // Gera algumas tecnologias iniciais na cidade
  for (let i = 0; i < 3; i++) {
    tecnologias.push(new Tecnologia(random(cidadeX + 50, width - 50), random(50, height - 50)));
  }
}

function draw() {
  background(220);
  
  // Desenha o Campo
  fill(144, 238, 144); // Verde claro
  noStroke();
  rect(campoX, campoY, campoLargura, campoAltura);
  
  // Desenha a Cidade
  fill(150, 150, 150); // Cinza
  noStroke();
  rect(cidadeX, cidadeY, cidadeLargura, cidadeAltura);
  
  // Linha divisória
  stroke(100);
  strokeWeight(2);
  line(width / 2, 0, width / 2, height);
  
  // Desenha e move os alimentos
  for (let i = alimentos.length - 1; i >= 0; i--) {
    alimentos[i].display();
    alimentos[i].move();
    
    if (alimentos[i].consumed) {
      alimentos.splice(i, 1);
      alimentosGerados++;
      // Gera um novo alimento automaticamente após um ser consumido, se desejar
      alimentos.push(new Alimento(random(50, campoLargura - 50), random(50, height - 50)));
    }
  }

  // Desenha e move as tecnologias
  for (let i = tecnologias.length - 1; i >= 0; i--) {
    tecnologias[i].display();
    tecnologias[i].move();
    
    if (tecnologias[i].arrived) {
      tecnologias.splice(i, 1);
      tecnologiaEnviada++;
      // Gera uma nova tecnologia automaticamente após uma ser enviada
      tecnologias.push(new Tecnologia(random(cidadeX + 50, width - 50), random(50, height - 50)));
    }
  }

  // Exibe os contadores
  fill(0);
  textSize(18);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text(`Alimentos Consumidos: ${alimentosGerados}`, 20, 30);
  text(`Tecnologia Enviada: ${tecnologiaEnviada}`, width / 2 + 20, 30);
}

function mousePressed() {
  // Interação com alimentos
  let alimentoMovido = false;
  for (let alimento of alimentos) {
    if (alimento.isHovered(mouseX, mouseY) && !alimento.isMoving) {
      alimento.startMoving();
      alimentoMovido = true;
      break; // Move apenas um alimento por clique
    }
  }
  
  // Interação com tecnologias
  let tecnologiaMovida = false;
  for (let tecnologia of tecnologias) {
    if (tecnologia.isHovered(mouseX, mouseY) && !tecnologia.isMoving) {
      tecnologia.startMoving();
      tecnologiaMovida = true;
      break; // Move apenas uma tecnologia por clique
    }
  }
  
  // Lógica para gerar novos elementos clicando na área
  if (!alimentoMovido && mouseX > campoX && mouseX < campoX + campoLargura &&
      mouseY > campoY && mouseY < campoY + campoAltura) {
      alimentos.push(new Alimento(mouseX, mouseY));
  }
  
  if (!tecnologiaMovida && mouseX > cidadeX && mouseX < cidadeX + cidadeLargura &&
      mouseY > cidadeY && mouseY < cidadeY + cidadeAltura) {
      tecnologias.push(new Tecnologia(mouseX, mouseY));
  }
}